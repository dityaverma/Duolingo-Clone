'use client'
import { useEffect, useState, useCallback } from 'react'
import Sidebar, { MobileNav, type AppView } from '@/components/duo/Sidebar'
import TopBar from '@/components/duo/TopBar'
import SkillTree from '@/components/duo/SkillTree'
import LessonPlayer from '@/components/duo/LessonPlayer'
import LessonComplete from '@/components/duo/LessonComplete'
import HeartsModal from '@/components/duo/HeartsModal'
import Leaderboard from '@/components/duo/Leaderboard'
import Profile from '@/components/duo/Profile'
import Shop from '@/components/duo/Shop'
import RightRail from '@/components/duo/RightRail'
import DuoMax from '@/components/duo/DuoMax'
import MathGrades from '@/components/duo/MathGrades'
import CoursePicker from '@/components/duo/CoursePicker'
import Onboarding, { ONBOARDING_KEY, type OnboardingData } from '@/components/duo/Onboarding'
import { Toaster, toast } from 'sonner'
import { useTheme } from 'next-themes'
import { loadMathTopic, saveMathTopic, type SelectedMathTopic } from '@/lib/mathGrades'
import { unlockAudio } from '@/lib/audio'
import type { User, Course, Lesson, AnswerResult, LeaderboardData, Achievement } from '@/lib/types'

async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || err.error || 'Request failed')
  }
  return res.json()
}

type Mode = 'lesson' | 'practice' | 'legendary'

export default function Home() {
  const [view, setView] = useState<AppView>('learn')
  const [user, setUser] = useState<User | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [activeMode, setActiveMode] = useState<Mode>('lesson')
  const [completeResult, setCompleteResult] = useState<any | null>(null)
  const [heartsOpen, setHeartsOpen] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)
  const [coursesOpen, setCoursesOpen] = useState(false)
  const [mathTopic, setMathTopic] = useState<SelectedMathTopic | null>(null)
  const [showMathGrades, setShowMathGrades] = useState(false)
  const [tutorSession] = useState(`session-${Date.now()}`)
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    try {
      setNeedsOnboarding(!localStorage.getItem(ONBOARDING_KEY))
      setMathTopic(loadMathTopic())
    } catch {
      setNeedsOnboarding(false)
    }
  }, [])

  const loadUser = useCallback(async () => setUser(await api<User>('/user')), [])
  const loadCourse = useCallback(async (lang?: string) => {
    const q = lang ? `?course=${lang}` : ''
    setCourse(await api<Course>(`/course${q}`))
  }, [])
  const loadLeaderboard = useCallback(async () => setLeaderboard(await api<LeaderboardData>('/leaderboard')), [])
  const loadAchievements = useCallback(async () => {
    const r = await api<{ achievements: Achievement[] }>('/achievements')
    setAchievements(r.achievements)
  }, [])

  useEffect(() => { loadUser(); loadAchievements() }, [loadUser, loadAchievements])
  useEffect(() => {
    if (user?.language) loadCourse(user.language)
    else loadCourse()
  }, [user?.language, loadCourse])
  useEffect(() => { if (view === 'leaderboard') loadLeaderboard() }, [view, loadLeaderboard])
  useEffect(() => { if (user?.theme && user.theme !== theme) setTheme(user.theme) }, [user?.theme])

  // Math without a selected topic → grades browser
  useEffect(() => {
    if (user?.language === 'math') {
      setShowMathGrades(!mathTopic)
    } else {
      setShowMathGrades(false)
    }
  }, [user?.language, mathTopic])

  async function switchCourse(code: string) {
    const res = await api<User>('/user', { method: 'POST', body: JSON.stringify({ language: code }) })
    setUser(res)
    await loadCourse(code)
    setView('learn')
    if (code === 'math') {
      setShowMathGrades(true)
    } else {
      setShowMathGrades(false)
    }
    toast.success(code === 'math' ? 'Switched to Math' : 'Switched to Spanish')
  }

  function selectMathTopic(topic: SelectedMathTopic) {
    setMathTopic(topic)
    saveMathTopic(topic)
    setShowMathGrades(false)
    setView('learn')
  }

  function backToMathGrades() {
    setShowMathGrades(true)
  }

  async function startLesson(lessonId: string, mode: Mode = 'lesson') {
    if (!user) return
    if (mode !== 'practice' && user.hearts <= 0) { setHeartsOpen(true); return }
    try {
      unlockAudio()
      const path = mode === 'legendary' ? `/lesson/${lessonId}/legendary` : `/lesson/${lessonId}`
      const lesson = await api<Lesson>(path)
      if (!lesson?.exercises?.length) {
        toast.error('Lesson has no questions yet')
        return
      }
      setActiveLesson(lesson)
      setActiveMode(mode)
    } catch (e: any) {
      toast.error(e?.message || 'Could not start lesson')
    }
  }

  async function answerExercise(exerciseId: string, answer: any): Promise<AnswerResult> {
    const res = await api<AnswerResult>('/answer', { method: 'POST', body: JSON.stringify({ exerciseId, answer }) })
    if (!res.correct && activeMode !== 'practice') setUser((u) => (u ? { ...u, hearts: res.hearts } : u))
    return res
  }

  async function completeLesson(payload: { xpEarned: number; mistakes: number; timeSec: number; mode: string }) {
    if (!activeLesson) return
    const res = await api<any>('/lesson/complete', { method: 'POST', body: JSON.stringify({ lessonId: activeLesson.id, ...payload }) })
    setUser(res.user)
    setActiveLesson(null)
    setCompleteResult({
      ...payload,
      xpEarned: res.xpEarned,
      newAchievements: res.newAchievements || [],
      streak: res.user?.streak ?? user?.streak,
    })
    if ((res.newAchievements || []).length) toast.success('🏆 New achievement unlocked!')
    loadCourse()
    loadAchievements()
  }

  function findPracticeLessonId(): string | null {
    if (!course) return null
    for (const u of course.units) {
      for (const s of u.skills) {
        if (s.finished && s.lessons[0]) return s.lessons[0].id
      }
    }
    // Fallback: any unlocked skill's first lesson (practice still awards +1 heart)
    for (const u of course.units) {
      for (const s of u.skills) {
        if (s.unlocked && s.lessons[0]) return s.lessons[0].id
      }
    }
    return null
  }

  function startPracticeForHearts() {
    setHeartsOpen(false)
    setView('learn')
    const id = findPracticeLessonId()
    if (!id) {
      toast.message('Finish a skill first, then practice it for +1 heart')
      return
    }
    void startLesson(id, 'practice')
  }

  async function refillHearts(method: string) {
    try {
      const res = await api<any>('/hearts/refill', { method: 'POST', body: JSON.stringify({ method }) })
      setUser(res.user)
      toast.success(method === 'gems' ? 'Hearts refilled!' : '+1 heart')
      setHeartsOpen(false)
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  async function updateUser(patch: any) {
    if (patch.theme) setTheme(patch.theme)
    const res = await api<User>('/user', { method: 'POST', body: JSON.stringify(patch) })
    setUser(res)
  }

  async function askExplain(params: { prompt: string; userAnswer: string; correctAnswer: string; exerciseType: string }) {
    const res = await api<{ reply: string }>('/tutor/explain', { method: 'POST', body: JSON.stringify({ sessionId: `explain-${Date.now()}`, ...params }) })
    return res.reply
  }

  async function tutorSend(message: string) {
    const res = await api<{ reply: string }>('/tutor/chat', { method: 'POST', body: JSON.stringify({ sessionId: tutorSession, message }) })
    return res.reply
  }

  async function finishOnboarding(data: OnboardingData) {
    setNeedsOnboarding(false)
    try {
      const lang = data.languageCode === 'math' ? 'math' : 'es'
      const res = await api<User>('/user', {
        method: 'POST',
        body: JSON.stringify({ dailyGoal: data.goalXp, language: lang }),
      })
      setUser(res)
      setCourse(await api<Course>(`/course?course=${lang}`))
      if (lang === 'math') setShowMathGrades(true)
    } catch { /* ignore */ }
    toast.success(`Welcome! Your daily goal is set to ${data.goalXp} XP 🎉`)
  }

  if (needsOnboarding === null) {
    return <div className="min-h-screen surface" />
  }

  if (needsOnboarding) {
    return <Onboarding onComplete={finishOnboarding} />
  }

  const isMath = user?.language === 'math'

  return (
    <div className="min-h-screen surface">
      <Toaster position="top-center" richColors />
      <Sidebar
        view={view}
        setView={setView}
        onOpenTutor={() => setTutorOpen(true)}
        onThemeChange={(t) => updateUser({ theme: t })}
      />
      <MobileNav view={view} setView={setView} onOpenTutor={() => setTutorOpen(true)} />

      <div className="md:pl-[260px] min-h-screen">
        <TopBar
          user={user}
          onHeartsClick={() => setHeartsOpen(true)}
          onSwitchCourse={switchCourse}
          onOpenShop={() => setView('shop')}
          onOpenCourses={() => setCoursesOpen(true)}
        />
        <div className="flex">
          <main className="flex-1 px-3 sm:px-4 md:px-8 py-4 sm:py-6 pb-24 md:pb-8 min-w-0">
            {view === 'learn' && !course && (
              <div className="max-w-xl mx-auto flex flex-col items-center gap-6 py-20">
                <div className="w-16 h-16 rounded-full bg-duo-green/20 animate-pulse" />
                <div className="text-xl font-black ink">Loading your path…</div>
              </div>
            )}

            {view === 'learn' && course && isMath && showMathGrades && (
              <MathGrades course={course} onSelectTopic={selectMathTopic} />
            )}

            {view === 'learn' && course && !(isMath && showMathGrades) && (
              <SkillTree
                course={course}
                mathTopic={isMath ? mathTopic : null}
                onStartLesson={(id) => startLesson(id, 'lesson')}
                onStartPractice={(id) => startLesson(id, 'practice')}
                onStartLegendary={(id) => startLesson(id, 'legendary')}
                onBackToGrades={isMath ? backToMathGrades : undefined}
              />
            )}

            {view === 'leaderboard' && leaderboard && <Leaderboard data={leaderboard} user={user} />}
            {view === 'profile' && user && <Profile user={user} onUpdate={updateUser} achievements={achievements} />}
            {view === 'shop' && user && <Shop user={user} onRefill={refillHearts} />}
            {view === 'quests' && user && (
              <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-black ink mb-6">Quests</h1>
                <div className="border-2 border-outline rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black ink text-lg">Daily Quests</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    <div className="flex-1">
                      <div className="font-black ink mb-1">Earn {user.dailyGoal || 10} XP</div>
                      <div className="h-3.5 bg-outline rounded-full overflow-hidden">
                        <div
                          className="h-full bg-duo-yellow rounded-full"
                          style={{ width: `${Math.min(100, ((user.dailyXp || 0) / (user.dailyGoal || 10)) * 100)}%` }}
                        />
                      </div>
                      <div className="text-xs font-bold ink-3 mt-1">{user.dailyXp || 0}/{user.dailyGoal || 10}</div>
                    </div>
                    <span className="text-2xl">🧰</span>
                  </div>
                </div>
                <div className="border-2 border-outline rounded-2xl p-6 ink-3 font-bold">
                  Monthly quests — Coming soon
                </div>
              </div>
            )}
            {view === 'settings' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-3xl font-black mb-4 ink">More</div>
                <div className="space-y-3">
                  {['Speech practice', 'Friends', 'Schools', 'Help center', 'Privacy', 'Terms'].map((x) => (
                    <div key={x} className="p-4 border-2 border-outline rounded-2xl font-bold ink-2">
                      {x} <span className="text-xs ink-3 font-normal ml-2">Coming soon</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
          <RightRail
            user={user}
            onViewQuests={() => setView('quests')}
          />
        </div>
      </div>

      {coursesOpen && user && (
        <CoursePicker
          activeCode={user.language || 'es'}
          onSelect={switchCourse}
          onClose={() => setCoursesOpen(false)}
        />
      )}

      {activeLesson && user && (
        <LessonPlayer
          lesson={activeLesson}
          user={user}
          mode={activeMode}
          onAnswer={answerExercise}
          onExplain={askExplain}
          onComplete={completeLesson}
          onQuit={() => setActiveLesson(null)}
          onPracticeFromHearts={startPracticeForHearts}
        />
      )}
      {completeResult && <LessonComplete result={completeResult} onContinue={() => setCompleteResult(null)} />}
      <HeartsModal
        open={heartsOpen}
        user={user}
        onClose={() => setHeartsOpen(false)}
        onRefill={refillHearts}
        onPractice={startPracticeForHearts}
      />
      <DuoMax open={tutorOpen} onClose={() => setTutorOpen(false)} sessionId={tutorSession} onSend={tutorSend} />
    </div>
  )
}
