'use client'
import { motion } from 'framer-motion'
import DuoOwl from './DuoOwl'

/** Welcome / intro Duo — eyes open, bounce + wave (works in light & dark). */
export default function AnimatedWelcomeDuo({ size = 180 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size + 24, height: size + 24 }}>
      {/* Soft ground glow — theme aware */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: size * 0.55,
          height: size * 0.12,
          background: 'var(--outline)',
          opacity: 0.85,
        }}
        animate={{ scaleX: [1, 0.72, 1], opacity: [0.7, 0.35, 0.7] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
      >
        <DuoOwl size={size} emotion="cheer" />
      </motion.div>
    </div>
  )
}
