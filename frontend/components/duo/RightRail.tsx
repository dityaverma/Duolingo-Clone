'use client'
import { Flame, Trophy, Lock } from 'lucide-react'
import type { User } from '@/lib/types'

export default function RightRail({
  user,
  onViewQuests,
}: {
  user: User | null
  onViewQuests?: () => void
}) {
  if (!user) return null
  const goal = user.dailyGoal || 10
  const progress = Math.min(100, ((user.dailyXp || 0) / goal) * 100)
  const lessonsLeft = Math.max(0, 3 - (user.achievements?.length ? 1 : 0))

  return (
    <aside className="hidden xl:flex flex-col gap-4 w-[340px] py-4 pl-4 pr-6 sticky top-16 self-start">
      <div className="border-2 border-outline rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <Trophy className="w-12 h-12 text-duo-gray" strokeWidth={1.75} />
            <Lock className="w-4 h-4 absolute -bottom-0.5 -right-0.5 text-duo-gray" />
          </div>
          <div>
            <div className="font-black ink text-lg leading-tight mb-1">Unlock Leaderboards!</div>
            <div className="text-sm font-bold ink-3 leading-snug">
              Complete {Math.max(1, lessonsLeft)} more lessons to start competing
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-outline rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black ink text-lg">Daily Quests</h3>
          <button onClick={onViewQuests} className="text-xs font-black uppercase tracking-wide text-duo-blue hover:underline">
            View all
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-3xl shrink-0">⚡</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black ink mb-1.5">Earn {goal} XP</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3.5 bg-outline rounded-full overflow-hidden">
                <div className="h-full bg-duo-yellow rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-black ink-3 whitespace-nowrap">{user.dailyXp || 0}/{goal}</span>
              <span className="text-lg" aria-hidden>🧰</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-outline rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <Flame className={`w-9 h-9 ${user.streak > 0 ? 'fill-duo-orange text-duo-orange' : 'text-duo-gray fill-duo-gray'}`} />
          <div>
            <div className="text-xl font-black ink">{user.streak || 0} day streak</div>
            <div className="text-sm ink-3 font-bold">Keep learning every day to grow it</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 pt-2">
        {['About', 'Blog', 'Store', 'Careers', 'Privacy'].map((l) => (
          <span key={l} className="text-[11px] font-bold uppercase tracking-wide ink-3 cursor-default">{l}</span>
        ))}
      </div>
    </aside>
  )
}
