'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { DuoJumpSticker } from './PathAssets'

export default function LessonComplete({
  result,
  onContinue,
}: {
  result: {
    xpEarned: number
    timeSec: number
    mistakes: number
    mode?: string
    newAchievements?: string[]
    streak?: number
  }
  onContinue: () => void
}) {
  const [xpShown, setXpShown] = useState(0)
  const targetXp = result.xpEarned || 0
  const accuracy = Math.max(0, 100 - (result.mistakes || 0) * 20)

  useEffect(() => {
    setXpShown(0)
    if (targetXp <= 0) return
    const steps = Math.min(targetXp, 24)
    const step = targetXp / steps
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setXpShown(i >= steps ? targetXp : Math.round(step * i))
      if (i >= steps) window.clearInterval(id)
    }, 40)
    return () => window.clearInterval(id)
  }, [targetXp])

  return (
    <div className="fixed inset-0 z-50 surface flex flex-col">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="confetti-dot" style={{
            left: `${(i * 37) % 100}%`, top: `${60 + ((i * 19) % 40)}%`,
            background: ['#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff4b4b'][i % 5],
            animationDelay: `${(i % 6) * 0.1}s`,
          }} />
        ))}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="mb-4 flex flex-col items-center gap-2"
        >
          <DuoJumpSticker size={160} />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-black text-duo-yellow mb-2"
        >
          Lesson Complete!
        </motion.h1>
        <p className="ink-3 font-bold mb-6">You&apos;re on fire! Keep going.</p>

        {(result.streak ?? 0) > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-2xl bg-duo-orange/15 border-2 border-duo-orange"
          >
            <Flame className="w-6 h-6 fill-duo-orange text-duo-orange" />
            <span className="font-black text-duo-orange">{result.streak} day streak</span>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-3 w-full max-w-lg mb-10">
          <StatCard label="Total XP" value={`+${xpShown}`} color="#ffc800" icon="⚡" />
          <StatCard label="Speedy" value={`${result.timeSec}s`} color="#1cb0f6" icon="⏱️" />
          <StatCard label="Amazing" value={`${accuracy}%`} color="#58cc02" icon="🎯" />
        </div>
        {result.newAchievements && result.newAchievements.length > 0 && (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-6 flex flex-col items-center"
          >
            <div className="ink-3 font-black uppercase text-sm mb-2">Achievement Unlocked!</div>
            <div className="px-4 py-2 rounded-2xl bg-duo-yellow/10 border-2 border-duo-yellow text-duo-yellow-dark font-black">
              🏆 {result.newAchievements.length} new
            </div>
          </motion.div>
        )}
      </div>
      <div className="border-t-2 border-outline p-4">
        <div className="max-w-3xl mx-auto flex justify-end">
          <button onClick={onContinue} className="duo-btn duo-btn-green px-10 py-3">Continue</button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: string }) {
  return (
    <div className="rounded-2xl border-2 border-outline overflow-hidden">
      <div className="py-2 text-center font-black text-white uppercase text-sm" style={{ background: color }}>{label}</div>
      <div className="surface py-4 flex items-center justify-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-black tabular-nums" style={{ color }}>{value}</span>
      </div>
    </div>
  )
}
