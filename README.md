# Scaler Assignment — Duolingo Clone

A full-stack Duolingo-style learning application built with **Next.js (TypeScript)**, **FastAPI**, and **SQLite**.

## Project Links

- **Live Application:** https://duolingo-clone-tau-black.vercel.app/
- **Backend API:** https://duolingo-clone-9ri3.onrender.com/
- **Source Code:** https://github.com/dityaverma/Duolingo-Clone

## Demo

<!-- Replace the URL below with the GitHub video URL after uploading your demo -->

[Project Walkthrough](YOUR_GITHUB_VIDEO_URL)

The demo covers the learning path, lesson flow, gamification, progress tracking, and Duo Max AI Tutor.

## Features

- Learning path with skill lock/unlock and crown progress
- Interactive lesson player
- Multiple exercise types:
  - Multiple choice
  - Word bank
  - Match pairs
  - Fill in the blank
  - Type answer
  - Follow the pattern
- XP and daily goals
- Streak tracking
- Hearts and regeneration
- Gems
- Leaderboard
- Achievements
- Duo Max AI Tutor powered by Groq
- Spanish and Mathematics courses
- Dark mode
- Responsive UI

## Architecture

```text
                  ┌─────────────────────┐
                  │       Next.js       │
                  │      TypeScript     │
                  │       Vercel        │
                  └──────────┬──────────┘
                             │
                          REST API
                             │
                             ▼
                  ┌─────────────────────┐
                  │       FastAPI       │
                  │       Render        │
                  └──────────┬──────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
              ┌──────────┐      ┌──────────┐
              │  SQLite  │      │  Groq AI │
              └──────────┘      └──────────┘
```

## Database Schema

The learning content follows:

**Unit → Skill → Lesson → Exercise**

```mermaid
erDiagram
    UNIT ||--o{ SKILL : contains
    SKILL ||--o{ LESSON : contains
    LESSON ||--o{ EXERCISE : contains

    USER ||--o{ USER_SKILL_PROGRESS : tracks
    USER ||--o{ USER_LESSON_PROGRESS : tracks
    USER ||--o{ USER_ACHIEVEMENT : earns
    USER ||--o{ LEADERBOARD_ENTRY : appears_in
    USER ||--o{ TUTOR_MESSAGE : has

    SKILL ||--o{ USER_SKILL_PROGRESS : tracks
    LESSON ||--o{ USER_LESSON_PROGRESS : tracks
    ACHIEVEMENT ||--o{ USER_ACHIEVEMENT : awards
```

## Project Structure

```text
Duolingo-Clone/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
├── render.yaml
└── README.md
```

## Local Setup

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Add the Groq API key to `.env`:

```env
GROQ_API_KEY=your_api_key
AI_MODEL=groq/compound-mini
```

### Frontend

Open a new terminal:

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Set:

```env
BACKEND_API_URL=http://localhost:8001
```

### Local URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8001
- API Health: http://localhost:8001/api/health

## Deployment

### Backend — Render

The backend is deployed using Docker and `render.yaml`.

Required environment variables:

```env
GROQ_API_KEY=your_api_key
AI_MODEL=groq/compound-mini
```

### Frontend — Vercel

Set the root directory to:

```text
frontend
```

Set the backend URL:

```env
BACKEND_API_URL=https://duolingo-clone-9ri3.onrender.com
```

## Deployment Challenges

### Render Cold Start

The backend may take longer to respond after a period of inactivity due to the hosting environment.

### SQLite

SQLite is suitable for this assignment, but PostgreSQL would be a better choice for a production multi-user application.

### Groq API

Duo Max depends on the Groq API, so AI responses can be affected by external API availability, rate limits, and latency.

## Assignment Focus

The project focuses on:

- Full-stack application architecture
- REST API design
- Database modeling
- Stateful lesson progression
- Gamification
- AI integration
- Frontend/backend integration
- deployment
