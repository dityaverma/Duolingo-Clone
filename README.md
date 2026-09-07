# Scaler Assignment — Duolingo Clone

Full-stack Duolingo-style learning app: **Next.js (TypeScript)** + **FastAPI** + **SQLite**.

## Features

- Learning path with lock/unlock skills and crown progress
- Lesson player (multiple choice, word bank, match pairs, fill blank, type answer, follow the pattern)
- XP, streaks, hearts, daily goal, leaderboard, achievements
- Duo Max AI tutor (Groq)
- Spanish + Math courses, dark mode, responsive UI

## Local setup

```bash
# Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add GROQ_API_KEY for Duo Max
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

# Frontend (new terminal)
cd frontend
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 — API health: http://localhost:8001/api/health

## Deploy

- **Backend:** Render (Docker / `render.yaml`) — set `GROQ_API_KEY`, `AI_MODEL=groq/compound-mini`
- **Frontend:** Vercel — root `frontend`, set `BACKEND_API_URL` to your Render URL (no trailing slash)

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind, framer-motion |
| Backend | FastAPI, SQLAlchemy async, Pydantic |
| Database | SQLite (seeded on startup) |
| AI | Groq (`groq/compound-mini`) |
