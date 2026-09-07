'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OfficialHeart } from './PathAssets'
import type { User } from '@/lib/types'

function formatRegen(ms: number) {
  if (ms <= 0) return 'any moment'
  const totalSec = Math.ceil(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  if (m <= 0) return `${s}s`
  return `${m}m ${String(s).padStart(2, '0')}s`
}

export default function HeartsModal({
  open,
  user,
  onClose,
  onRefill,
  onPractice,
}: {
  open: boolean
  user: User | null
  onClose: () => void
  onRefill: (m: string) => void
  onPractice?: () => void
}) {
  const [regenLeft, setRegenLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!open || !user?.heartsRegenAt || user.hearts >= user.maxHearts) {
      setRegenLeft(null)
      return
    }
    const tick = () => setRegenLeft(new Date(user.heartsRegenAt!).getTime() - Date.now())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [open, user?.heartsRegenAt, user?.hearts, user?.maxHearts])

  if (!open || !user) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="surface rounded-3xl max-w-md w-full overflow-hidden border-2 border-outline">
          <div className="bg-duo-red/10 dark:bg-duo-red/20 p-6 text-center">
            <div className="flex justify-center gap-1 mb-3">
              {Array.from({ length: user.maxHearts }).map((_, i) => (
                <OfficialHeart key={i} size={36} empty={i >= user.hearts} />
              ))}
            </div>
            <div className="text-2xl font-black text-duo-red">You have {user.hearts} hearts</div>
            <div className="text-duo-red-dark dark:text-duo-red font-bold text-sm mt-1">
              {user.hearts <= 0
                ? 'You need hearts to keep learning'
                : 'Get more to keep learning'}
            </div>
            {regenLeft != null && user.hearts < user.maxHearts && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-black/20 text-sm font-black text-duo-red">
                ⏱ Next heart in {formatRegen(regenLeft)}
              </div>
            )}
          </div>
          <div className="p-5 space-y-3">
            <button disabled={user.hearts >= user.maxHearts || user.gems < 350} onClick={() => onRefill('gems')}
              className="w-full flex items-center justify-between p-4 border-2 border-outline rounded-2xl hover:surface-2 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="text-3xl">❤️</div>
                <div className="text-left">
                  <div className="font-black ink">Refill hearts</div>
                  <div className="text-sm ink-3">Get all 5 hearts back</div>
                </div>
              </div>
              <div className="flex items-center gap-1 font-black text-duo-blue">
                <span>💎</span><span>350</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onPractice?.()}
              className="w-full flex items-center justify-between p-4 border-2 border-outline rounded-2xl hover:surface-2 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">💪</div>
                <div className="text-left">
                  <div className="font-black ink">Practice a skill</div>
                  <div className="text-sm ink-3">Complete a practice for +1 heart</div>
                </div>
              </div>
              <div className="font-black text-duo-green text-xs uppercase tracking-wide">Start</div>
            </button>
            <div className="w-full flex items-center justify-between p-4 border-2 border-outline rounded-2xl opacity-60">
              <div className="flex items-center gap-3">
                <div className="text-3xl">♾️</div>
                <div className="text-left">
                  <div className="font-black ink">Unlimited hearts</div>
                  <div className="text-sm ink-3">Super Duolingo</div>
                </div>
              </div>
              <div className="font-bold ink-3 text-sm">Coming soon</div>
            </div>
          </div>
          <div className="p-4 border-t-2 border-outline">
            <button onClick={onClose} className="w-full duo-btn duo-btn-white py-3">No thanks</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
