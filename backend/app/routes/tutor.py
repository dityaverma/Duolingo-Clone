"""Duo Max AI Tutor — Groq integration.
   POST /api/tutor/explain — explain why an answer was wrong (grounded in provided facts)
   POST /api/tutor/chat    — free-form conversational tutor (session-persistent)
"""
from fastapi import APIRouter, HTTPException, Depends
from groq import Groq
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import re

from ..database import get_session
from ..config import settings
from ..schemas import TutorChatRequest, ExplainRequest
from ..models import TutorMessage

router = APIRouter(prefix='/api/tutor')

EXPLAIN_SYSTEM = (
    "You are Duo Max, a friendly Spanish tutor inside a Duolingo-style lesson.\n"
    "CRITICAL RULES — follow exactly:\n"
    "1. ALWAYS write your entire explanation in clear English. Spanish words/phrases may appear only as examples being discussed.\n"
    "2. Use ONLY the facts in the user message (question, learner answer, correct answer, exercise type).\n"
    "3. Never invent a different correct answer. The 'Correct answer' field is absolute truth.\n"
    "4. Never invent vocabulary, conjugations, or grammar rules that contradict that correct answer.\n"
    "5. If you are unsure why something is wrong, say so briefly and restate the correct answer.\n"
    "6. Keep the reply under 80 words. Plain sentences only — no markdown headers, no bullet lists, no code blocks.\n"
    "7. Be encouraging and playful. At most one emoji (🦉 or ✨).\n"
    "8. Structure: (1) what was wrong, (2) why the correct form fits, (3) one short memory tip tied to THIS example."
)

CHAT_SYSTEM = (
    "You are Duo Max, a friendly Spanish language tutor in a learning app.\n"
    "CRITICAL RULES:\n"
    "1. ALWAYS reply in clear English. You may quote Spanish words or example sentences, but explanations, tips, and questions must be in English.\n"
    "2. Stay on Spanish learning. Refuse unrelated topics in one short English sentence, then offer a Spanish tip.\n"
    "3. Do not invent fake 'facts' about the learner's progress, XP, hearts, or lessons.\n"
    "4. When correcting Spanish, show the corrected phrase clearly, then explain the fix in English. Prefer common, standard Spanish (Latin America or Spain — pick one and stay consistent).\n"
    "5. If unsure of a translation, say you are unsure rather than guessing.\n"
    "6. Keep replies under 100 words. No markdown headers. At most one emoji.\n"
    "7. Ask at most one short follow-up question in English."
)

MAX_CHAT_HISTORY = 12


def get_groq_client():
    key = (settings.GROQ_API_KEY or '').strip()
    if not key:
        raise HTTPException(
            status_code=503,
            detail='Groq API key not configured. Set GROQ_API_KEY in backend/.env',
        )
    return Groq(api_key=key)


def _model_name() -> str:
    model = (settings.AI_MODEL or '').strip()
    if not model or 'gemini' in model.lower():
        return 'groq/compound-mini'
    if model in {
        'llama-3.1-8b-instant',
        'llama3-8b-8192',
        'llama-3.3-70b-versatile',
        'openai/gpt-oss-20b',
    }:
        return 'groq/compound-mini'
    return model


def _strip_markdown(text: str) -> str:
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    text = re.sub(r'`(.+?)`', r'\1', text)
    text = re.sub(r'^#{1,6}\s*', '', text, flags=re.M)
    return text.strip()


def _safe_text(text: str | None, fallback: str) -> str:
    cleaned = _strip_markdown((text or '').strip())
    return cleaned if cleaned else fallback


def _ground_explain_reply(text: str, correct_answer: str) -> str:
    """Keep explanations grounded: always surface the provided correct answer."""
    reply = _safe_text(text, '')
    ca = (correct_answer or '').strip()
    if not reply:
        return f"Good try! The correct answer is “{ca}”. Keep going — you've got this! 🦉"

    def norm(s: str) -> str:
        s = s.lower().strip()
        s = re.sub(r"[¿?¡!.,\"'`]", '', s)
        s = re.sub(r"\s+", ' ', s)
        return s

    # Drop trailing incomplete clause fragments
    reply = re.sub(r'[,:;]\s*(which|and|but|so)?\s*$', '.', reply, flags=re.I)
    if reply and reply[-1] not in '.!?…':
        reply = reply.rstrip(',;:') + '.'

    if ca and norm(ca) and norm(ca) not in norm(reply):
        reply = f"{reply.rstrip()} The correct answer is “{ca}”."
    return reply


@router.post('/explain')
async def explain(body: ExplainRequest, session: AsyncSession = Depends(get_session)):
    prompt = (
        "A learner answered a Spanish exercise incorrectly. Explain using ONLY these facts:\n\n"
        f"Exercise type: {body.exerciseType}\n"
        f"Question / prompt: {body.prompt}\n"
        f"Learner's answer: {body.userAnswer}\n"
        f"Correct answer: {body.correctAnswer}\n\n"
        "Reminders:\n"
        "- Write the whole explanation in English (Spanish only for example phrases).\n"
        "- Do not change or replace the Correct answer.\n"
        "- Do not introduce other possible correct answers.\n"
        "- 2–3 short sentences: what went wrong, why this correct answer fits, one memory tip.\n"
        "- Encouraging tone. No headers."
    )
    try:
        client = get_groq_client()
        completion = client.chat.completions.create(
            model=_model_name(),
            messages=[
                {"role": "system", "content": EXPLAIN_SYSTEM},
                {"role": "user", "content": prompt},
            ],
            temperature=0.25,
            max_tokens=500,
            top_p=0.9,
        )
        raw = completion.choices[0].message.content
        text = _ground_explain_reply(raw, body.correctAnswer)
    except HTTPException:
        raise
    except Exception as e:
        text = (
            f"Nice effort! Your answer was “{body.userAnswer}”, but the correct answer is "
            f"“{body.correctAnswer}”. Compare them closely and try again next time. 🦉"
        )
        if 'api key' in str(e).lower() or 'authentication' in str(e).lower():
            raise HTTPException(status_code=502, detail=f'LLM error: {e}') from e

    session.add(TutorMessage(session_id=body.sessionId, role='user', content=prompt))
    session.add(TutorMessage(session_id=body.sessionId, role='assistant', content=text))
    await session.commit()
    return {'reply': text}


@router.post('/chat')
async def chat(body: TutorChatRequest, session: AsyncSession = Depends(get_session)):
    message = (body.message or '').strip()
    if not message:
        raise HTTPException(status_code=400, detail='Message is required')
    if len(message) > 1000:
        raise HTTPException(status_code=400, detail='Message too long (max 1000 characters)')

    try:
        rows = (await session.execute(
            select(TutorMessage)
            .where(TutorMessage.session_id == body.sessionId)
            .order_by(TutorMessage.created_at)
        )).scalars().all()

        history = []
        for r in rows:
            if r.role == 'user' and r.content.startswith('A learner answered a Spanish exercise'):
                continue
            history.append(r)
        history = history[-MAX_CHAT_HISTORY:]

        messages = [{"role": "system", "content": CHAT_SYSTEM}]
        for r in history:
            messages.append({"role": r.role, "content": r.content})
        messages.append({"role": "user", "content": message})

        client = get_groq_client()
        completion = client.chat.completions.create(
            model=_model_name(),
            messages=messages,
            temperature=0.35,
            max_tokens=400,
            top_p=0.9,
        )
        text = _safe_text(
            completion.choices[0].message.content,
            "I'm here to help with Spanish — ask in English about a phrase or grammar tip. 🦉",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f'LLM error: {e}') from e

    session.add(TutorMessage(session_id=body.sessionId, role='user', content=message))
    session.add(TutorMessage(session_id=body.sessionId, role='assistant', content=text))
    await session.commit()
    return {'reply': text}


@router.get('/history/{session_id}')
async def history(session_id: str, session: AsyncSession = Depends(get_session)):
    rows = (await session.execute(
        select(TutorMessage).where(TutorMessage.session_id == session_id).order_by(TutorMessage.created_at)
    )).scalars().all()
    return {
        'messages': [
            {'role': r.role, 'content': r.content, 'createdAt': r.created_at.isoformat()}
            for r in rows
        ]
    }
