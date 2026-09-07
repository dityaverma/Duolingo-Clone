'use client'
import { motion } from 'framer-motion'
import MathDuoRive from './MathDuoRive'
import { OfficialChest } from './PathAssets'

export type Emotion = 'happy' | 'sad' | 'cheer' | 'idle' | 'thinking' | 'sleep' | 'wave'

export default function DuoOwl({ emotion = 'idle', size = 96 }: { emotion?: Emotion; size?: number }) {
  const eyeShape = (() => {
    switch (emotion) {
      case 'happy':
      case 'wave':
        return <path d="M -6 0 Q 0 8 6 0" fill="none" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
      case 'cheer':
        return <circle r="3.5" fill="#3c3c3c" />
      case 'sad':
        return <path d="M -5 2 Q 0 -3 5 2" fill="none" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
      case 'thinking':
        return <ellipse rx="3.5" ry="4" fill="#3c3c3c" />
      case 'sleep':
        return <path d="M -6 0 L 6 0" stroke="#3c3c3c" strokeWidth="3" strokeLinecap="round" />
      default:
        return <circle r="4" fill="#3c3c3c" />
    }
  })()

  const mouth = (() => {
    switch (emotion) {
      case 'happy':
      case 'cheer':
      case 'wave':
        return <path d="M 42 68 Q 50 78 58 68" stroke="#ff9600" strokeWidth="3" fill="#ff9600" />
      case 'sad':
        return <path d="M 42 74 Q 50 66 58 74" stroke="#ff9600" strokeWidth="3" fill="none" />
      case 'thinking':
        return <ellipse cx="50" cy="70" rx="3" ry="2" fill="#ff9600" />
      default:
        return <path d="M 44 70 Q 50 74 56 70" stroke="#ff9600" strokeWidth="3" fill="#ff9600" />
    }
  })()

  const bounce = emotion === 'cheer'
    ? { rotate: [-5, 5, -5, 5, 0], y: [0, -2, 0] }
    : emotion === 'wave'
      ? { rotate: [0, -6, 6, 0] }
      : { rotate: 0 }

  const transition = emotion === 'cheer'
    ? { duration: 0.7, repeat: Infinity, repeatDelay: 0.35 }
    : emotion === 'wave'
      ? { duration: 0.8, repeat: Infinity, repeatDelay: 0.6 }
      : { duration: 0.25 }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      animate={bounce}
      transition={transition}
      style={{ overflow: 'visible' }}
    >
      <ellipse cx="50" cy="96" rx="28" ry="4" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="50" cy="58" rx="36" ry="38" fill="#58cc02" />
      <ellipse cx="50" cy="62" rx="26" ry="28" fill="#89e219" />
      <path d="M 20 30 L 26 12 L 34 26 Z" fill="#58cc02" />
      <path d="M 80 30 L 74 12 L 66 26 Z" fill="#58cc02" />
      <g className={emotion === 'sleep' ? '' : 'duo-eye-blink'}>
        <ellipse cx="36" cy="46" rx="12" ry="14" fill="white" />
        <ellipse cx="64" cy="46" rx="12" ry="14" fill="white" />
        <g transform="translate(36 47)">{eyeShape}</g>
        <g transform="translate(64 47)">{eyeShape}</g>
      </g>
      <path d="M 46 60 L 54 60 L 50 68 Z" fill="#ff9600" />
      {mouth}
      <ellipse cx="38" cy="92" rx="8" ry="4" fill="#ff9600" />
      <ellipse cx="62" cy="92" rx="8" ry="4" fill="#ff9600" />
      <ellipse cx="50" cy="78" rx="12" ry="6" fill="#d7ffb8" opacity="0.5" />
      {emotion === 'thinking' && (
        <g>
          <circle cx="78" cy="28" r="4" fill="#ce82ff" opacity="0.9" />
          <circle cx="86" cy="18" r="3" fill="#ce82ff" opacity="0.7" />
          <circle cx="92" cy="10" r="2" fill="#ce82ff" opacity="0.5" />
        </g>
      )}
    </motion.svg>
  )
}

/** Official Math path Rive mascot (Duo on clock). */
export function DuoOnClock({ size = 200 }: { size?: number }) {
  return <MathDuoRive size={size} interactive={false} />
}

/** Treasure chest — official Duolingo path SVG */
export function PathChest({ locked = true, opened = false }: { locked?: boolean; opened?: boolean }) {
  return <OfficialChest locked={locked} opened={opened} size={56} />
}
