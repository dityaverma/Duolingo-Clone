'use client'
import { Flame, Gem, Zap } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { MathIcon, FlagCourseIcon } from './MathIcon'
import { OfficialHeart } from './PathAssets'
import type { User } from '@/lib/types'

const MY_COURSES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'math', name: 'Math', flag: '🔢', math: true },
]

function formatRegen(ms: number) {
  if (ms <= 0) return 'soon'
  const totalSec = Math.ceil(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  if (m <= 0) return `${s}s`
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

export default function TopBar({
  user,
  onHeartsClick,
  onSwitchCourse,
  onOpenShop,
  onOpenCourses,
}: {
  user: User | null
  onHeartsClick: () => void
  onSwitchCourse?: (code: string) => void
  onOpenShop?: () => void
  onOpenCourses?: () => void
}) {
  const [coursesOpen, setCoursesOpen] = useState(false)
  const [gemsOpen, setGemsOpen] = useState(false)
  const [regenLeft, setRegenLeft] = useState<number | null>(null)
  const coursesRef = useRef<HTMLDivElement>(null)
  const gemsRef = useRef<HTMLDivElement>(null)
  const active = MY_COURSES.find((c) => c.code === user?.language) || MY_COURSES[0]

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node
      if (coursesRef.current && !coursesRef.current.contains(t)) setCoursesOpen(false)
      if (gemsRef.current && !gemsRef.current.contains(t)) setGemsOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (!user?.heartsRegenAt || user.hearts >= user.maxHearts) {
      setRegenLeft(null)
      return
    }
    const tick = () => {
      const left = new Date(user.heartsRegenAt!).getTime() - Date.now()
      setRegenLeft(left)
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [user?.heartsRegenAt, user?.hearts, user?.maxHearts])

  if (!user) return null

  return (
    <div className="sticky top-0 z-30 surface">
      <div className="flex items-center justify-end gap-2.5 sm:gap-4 md:gap-5 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3">
        {/* Streak */}
        <div className="flex items-center gap-1" title={`${user.streak} day streak`}>
          <Flame className={`w-6 h-6 sm:w-7 sm:h-7 ${user.streak > 0 ? 'fill-duo-orange text-duo-orange' : 'text-duo-gray fill-duo-gray'}`} />
          <span className={`font-black text-base sm:text-lg ${user.streak > 0 ? 'text-duo-orange' : 'text-duo-gray'}`}>{user.streak || 0}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1" title={`${user.xp} total XP`}>
          <Zap className="w-6 h-6 sm:w-7 sm:h-7 fill-duo-yellow text-duo-yellow" />
          <span className="font-black text-base sm:text-lg text-duo-yellow">{user.xp || 0}</span>
        </div>

        {/* Gems + popover */}
        <div className="relative" ref={gemsRef}>
          <button
            onClick={() => { setGemsOpen((v) => !v); setCoursesOpen(false) }}
            className={`flex items-center gap-1 rounded-2xl px-1.5 sm:px-2.5 py-1 transition ${gemsOpen ? 'bg-outline/60' : 'hover:bg-outline/40'}`}
            title="Gems"
          >
            <Gem className="w-5 h-5 sm:w-6 sm:h-6 fill-duo-blue text-duo-blue" />
            <span className="font-black text-base sm:text-lg text-duo-blue">{user.gems || 0}</span>
          </button>
          {gemsOpen && (
            <div className="absolute right-0 top-full mt-3 w-[min(18rem,calc(100vw-1.5rem))] surface-2 border-2 border-outline rounded-2xl z-50 p-4"
              style={{ boxShadow: '0 4px 0 0 var(--shadow-outline)' }}>
              <div className="absolute -top-2 right-8 w-3 h-3 rotate-45 surface-2 border-l-2 border-t-2 border-outline" />
              <div className="flex items-center gap-4">
                <div className="text-5xl shrink-0" aria-hidden>🧰</div>
                <div className="min-w-0">
                  <div className="text-xl font-black ink">Gems</div>
                  <div className="font-bold ink text-sm mb-2">You have {user.gems || 0} gems</div>
                  <button
                    onClick={() => {
                      setGemsOpen(false)
                      onOpenShop?.()
                    }}
                    className="text-sm font-black uppercase tracking-wide text-duo-blue hover:underline"
                  >
                    Go to shop
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hearts */}
        <button
          onClick={onHeartsClick}
          className="flex items-center gap-1 duo-press rounded-xl"
          title={regenLeft != null && regenLeft > 0 ? `Next heart in ${formatRegen(regenLeft)}` : 'Hearts'}
        >
          <OfficialHeart size={28} empty={!user.hearts} className={user.hearts > 0 ? '' : 'opacity-50'} />
          <span className={`font-black text-base sm:text-lg ${user.hearts > 0 ? 'text-duo-red' : 'text-duo-gray'}`}>{user.hearts}</span>
        </button>

        {/* Course switcher — right side with stats */}
        <div className="relative" ref={coursesRef}>
          <button
            onClick={() => { setCoursesOpen((v) => !v); setGemsOpen(false) }}
            className="duo-press rounded-xl p-0.5"
            title="My courses"
          >
            {active.code === 'math' ? <MathIcon size={36} /> : <FlagCourseIcon flag={active.flag} size={36} />}
          </button>

          {coursesOpen && (
            <div className="absolute right-0 top-full mt-3 w-[min(16rem,calc(100vw-1.5rem))] surface-2 border-2 border-outline rounded-2xl z-50 overflow-hidden"
              style={{ boxShadow: '0 4px 0 0 var(--shadow-outline)' }}>
              <div className="absolute -top-2 right-5 w-3 h-3 rotate-45 surface-2 border-l-2 border-t-2 border-outline" />
              <div className="px-4 pt-4 pb-2 text-[11px] font-black uppercase tracking-wider ink-3">
                My courses
              </div>
              {MY_COURSES.map((c) => {
                const selected = c.code === active.code
                return (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCoursesOpen(false)
                      onSwitchCourse?.(c.code)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 font-black text-left ${
                      selected ? 'bg-duo-blue/15 text-duo-blue' : 'ink hover:surface'
                    }`}
                  >
                    {c.math ? <MathIcon size={36} /> : <FlagCourseIcon flag={c.flag} size={36} />}
                    <span>{c.name}</span>
                  </button>
                )
              })}
              <div className="border-t-2 border-outline" />
              <button
                onClick={() => {
                  setCoursesOpen(false)
                  onOpenCourses?.()
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 font-black ink hover:surface text-left"
              >
                <div className="w-9 h-9 rounded-xl border-2 border-outline flex items-center justify-center text-xl ink-3 bg-white">+</div>
                <span>Add a new course</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
