from pydantic import BaseModel, Field
from typing import Any, Optional


class UserOut(BaseModel):
    id: str
    name: str
    avatar: str
    createdAt: str
    xp: int
    streak: int
    lastActive: Optional[str]
    hearts: int
    maxHearts: int
    heartsRegenAt: Optional[str]
    gems: int
    dailyGoal: int
    dailyXp: int
    dailyXpDate: str
    language: str
    theme: str
    skillProgress: dict[str, dict]
    lessonProgress: dict[str, dict]
    achievements: list[str]


class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    dailyGoal: Optional[int] = None
    theme: Optional[str] = None
    language: Optional[str] = None  # es | math


class AnswerRequest(BaseModel):
    exerciseId: str
    answer: Any


class AnswerResponse(BaseModel):
    correct: bool
    correctAnswer: Optional[Any] = None
    hearts: int
    translation: Optional[str] = None


class CompleteLessonRequest(BaseModel):
    lessonId: str
    xpEarned: int = 15
    mistakes: int = 0
    timeSec: int = 0
    mode: str = 'lesson'  # lesson | practice | legendary


class HeartsRefillRequest(BaseModel):
    method: str = 'gems'  # gems | practice | ad


class TutorChatRequest(BaseModel):
    sessionId: str
    message: str


class ExplainRequest(BaseModel):
    sessionId: str = 'default-explain'
    prompt: str
    userAnswer: str
    correctAnswer: str
    exerciseType: str
