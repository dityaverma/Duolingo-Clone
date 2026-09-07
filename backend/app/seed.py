"""Seeds the SQLite database with course content, achievements, and leaderboard.
Idempotent: safe to run on every startup. Also backfills Math course if missing.
Seeds a sample learner with partial progress so the path is immediately demoable.
"""
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .database import AsyncSessionLocal, engine, Base
from .models import (
    Unit, Skill, Lesson, Exercise, Achievement, LeaderboardEntry,
    User, UserSkillProgress, UserLessonProgress,
)
from .seed_data import COURSE, MATH_COURSE, ACHIEVEMENTS, LEADERBOARD_SEED
from .utils import DEFAULT_USER_ID, today_str


async def _seed_units(s: AsyncSession, units: list[dict]):
    for u in units:
        existing = await s.get(Unit, u['id'])
        if existing:
            continue
        unit = Unit(
            id=u['id'], title=u['title'], subtitle=u['subtitle'], color=u['color'],
            color_dark=u['color_dark'], order_index=u['order_index'],
        )
        s.add(unit)
        for sk in u['skills']:
            skill = Skill(
                id=sk['id'], unit_id=u['id'], title=sk['title'], icon=sk['icon'],
                description=sk['description'], order_index=sk['order_index'],
            )
            s.add(skill)
            for l in sk['lessons']:
                lesson = Lesson(id=l['id'], skill_id=sk['id'], title=l['title'], order_index=l['order_index'])
                s.add(lesson)
                for i, e in enumerate(l['exercises']):
                    s.add(Exercise(id=e['id'], lesson_id=l['id'], type=e['type'], order_index=i, payload=e['payload']))
    await s.commit()


async def _seed_sample_learner(s: AsyncSession):
    """Create default learner with partial Spanish progress."""
    user = await s.get(User, DEFAULT_USER_ID)
    if user is None:
        user = User(
            id=DEFAULT_USER_ID,
            name='Learner',
            avatar='🦉',
            xp=15,
            streak=1,
            last_active=today_str(),
            hearts=4,
            max_hearts=5,
            hearts_regen_at=datetime.utcnow() + timedelta(minutes=12),
            gems=500,
            daily_goal=20,
            daily_xp=15,
            daily_xp_date=today_str(),
            language='es',
            theme='light',
        )
        s.add(user)
        await s.flush()

    # Only seed progress once — don't overwrite an active learner
    existing_lp = (await s.execute(
        select(UserLessonProgress).where(UserLessonProgress.user_id == user.id)
    )).scalars().first()
    if existing_lp:
        return

    # Give brand-new / empty learners sample stats for a usable demo path
    if user.xp == 0:
        user.xp = 15
        user.streak = max(user.streak, 1)
        user.last_active = today_str()
        user.daily_xp = max(user.daily_xp, 15)
        user.daily_xp_date = today_str()
        if user.hearts >= user.max_hearts:
            user.hearts = 4
            user.hearts_regen_at = datetime.utcnow() + timedelta(minutes=12)

    # Finish first Greet lesson; leave skill mid-way so next skill stays locked
    s.add(UserLessonProgress(
        user_id=user.id, lesson_id='l1', completed=True, mistakes=1, time_sec=90,
    ))
    s.add(UserSkillProgress(
        user_id=user.id, skill_id='s1', crowns=0, lessons_completed=1,
    ))
    await s.commit()


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as s:  # type: AsyncSession
        await _seed_units(s, COURSE['units'])
        await _seed_units(s, MATH_COURSE['units'])

        if not (await s.execute(select(Achievement))).scalars().first():
            for a in ACHIEVEMENTS:
                s.add(Achievement(**a))
            await s.commit()

        if not (await s.execute(select(LeaderboardEntry))).scalars().first():
            for lb in LEADERBOARD_SEED:
                s.add(LeaderboardEntry(**lb))
            await s.commit()

        await _seed_sample_learner(s)
