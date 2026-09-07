'use client'
import { useState, useEffect, type ReactNode, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Clock, ChevronLeft, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { DuoOnClock, PathChest } from './DuoOwl'
import { PathStarIcon, PathTrophyIcon, DuoPencilSticker } from './PathAssets'
import type { Course, SkillNodeData } from '@/lib/types'
import type { SelectedMathTopic } from '@/lib/mathGrades'

/** Zigzag offsets — Duolingo winding path (smaller on mobile via CSS) */
const OFFSETS = [0, 48, 80, 48, 0, -48, -80, -48]
const OFFSETS_MOBILE = [0, 28, 44, 28, 0, -28, -44, -28]

type PathNodeKind = 'star' | 'chest' | 'clock' | 'trophy'

function SkillGlyph({ name, state }: { name: string; state: string }) {
  const lockedCls = 'w-9 h-9'
  const lockedStyle = { color: 'var(--path-locked-icon)' }
  if (state === 'locked') {
    if (name === 'clock') return <Clock className={lockedCls} style={lockedStyle} strokeWidth={2.5} />
    if (name === 'trophy') return <PathTrophyIcon size={36} className="opacity-50 brightness-50" />
    return <PathStarIcon size={36} className="opacity-45 brightness-50" />
  }
  if (state === 'done') return <PathStarIcon size={44} className="brightness-0 invert" />
  const map: Record<string, ReactNode> = {
    star: <PathStarIcon size={44} className="brightness-0 invert" />,
    plane: <span className="text-3xl">✈️</span>,
    family: <span className="text-3xl">👪</span>,
    apple: <span className="text-3xl">🍎</span>,
    paw: <span className="text-3xl">🐾</span>,
    palette: <span className="text-3xl">🎨</span>,
    hash: <span className="text-3xl">🔢</span>,
    plus: <span className="text-4xl font-black text-white">+</span>,
    minus: <span className="text-4xl font-black text-white">−</span>,
    clock: <Clock className="w-10 h-10 text-white" strokeWidth={2.5} />,
    trophy: <PathTrophyIcon size={40} className="brightness-0 invert" />,
  }
  return <>{map[name] || <PathStarIcon size={44} className="brightness-0 invert" />}</>
}

function CrownRow({ crowns, lessonFrac }: { crowns: number; lessonFrac?: number }) {
  const filled = Math.max(0, Math.min(5, crowns))
  const partial = Boolean(crowns < 5 && lessonFrac && lessonFrac > 0 && lessonFrac < 1)
  return (
    <div className="flex gap-0.5 mt-2" title={`${filled} crown${filled === 1 ? '' : 's'}`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const on = i < filled
        const next = partial && i === filled
        return (
          <PathStarIcon
            key={i}
            size={12}
            className={cn(
              on && '',
              next && 'opacity-75',
              !on && !next && 'opacity-30 brightness-50',
            )}
          />
        )
      })}
    </div>
  )
}

function PathCircle({
  state, color, colorDark, icon, isCurrent, onClick, crowns = 0, lessonProgress = 0,
}: {
  state: 'active' | 'done' | 'locked'
  color: string
  colorDark: string
  icon: string
  isCurrent?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  crowns?: number
  /** 0–1 lesson completion within the skill */
  lessonProgress?: number
}) {
  const bg = state === 'locked' ? 'var(--path-locked)' : state === 'done' ? '#ffc800' : color
  const bgDark = state === 'locked' ? 'var(--path-locked-shadow)' : state === 'done' ? '#e6b400' : colorDark
  const clickable = state !== 'locked' && !!onClick
  const ringPct = Math.round(Math.min(1, Math.max(0, lessonProgress)) * 100)

  return (
    <div className="relative flex flex-col items-center">
      {isCurrent && state === 'active' && (
        <button
          type="button"
          onClick={onClick}
          className="absolute -top-11 z-10"
        >
          <div
            className="bg-white dark:bg-[var(--surface-2)] text-duo-green font-black uppercase text-xs tracking-widest px-3.5 py-1.5 rounded-xl border-2 border-outline relative"
            style={{ boxShadow: '0 2px 0 0 var(--shadow-outline)' }}
          >
            START
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-[var(--surface-2)] border-b-2 border-r-2 border-outline" />
          </div>
        </button>
      )}
      <div className="relative">
        {state !== 'locked' && lessonProgress > 0 && lessonProgress < 1 && (
          <div
            className="absolute -inset-1.5 rounded-full pointer-events-none"
            style={{
              background: `conic-gradient(${color} ${ringPct}%, var(--outline, #e5e5e5) 0)`,
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))',
            }}
          />
        )}
        <button
          type="button"
          disabled={!clickable}
          onClick={onClick}
          className={cn(
            'skill-node w-16 h-16 sm:w-[72px] sm:h-[72px] relative z-[1]',
            state === 'locked' && 'locked',
          )}
          style={{ background: bg, boxShadow: `0 6px 0 0 ${bgDark}` }}
        >
          <SkillGlyph name={icon} state={state} />
        </button>
      </div>
      {state !== 'locked' && (
        <CrownRow crowns={crowns} lessonFrac={lessonProgress} />
      )}
    </div>
  )
}

/** Portal popup — always above path, Start button always clickable */
function SkillPopover({
  skill, unitColor, unitColorDark, anchorRect, onStart, onPractice, onLegendary, onClose,
}: {
  skill: SkillNodeData
  unitColor: string
  unitColorDark: string
  anchorRect: DOMRect | null
  onStart: (id: string) => void
  onPractice: (id: string) => void
  onLegendary: (id: string) => void
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const top = anchorRect ? Math.min(anchorRect.bottom + 12, window.innerHeight - 220) : 160
  const left = anchorRect ? anchorRect.left + anchorRect.width / 2 : window.innerWidth / 2

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 z-[200] bg-black/30"
        onClick={onClose}
      />
      <motion.div
        key="panel"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[210] w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2"
        style={{ top, left }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-2xl p-5 text-white text-center relative"
          style={{ background: unitColor, boxShadow: `0 6px 0 0 ${unitColorDark}` }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45" style={{ background: unitColor }} />
          <div className="text-xl font-black mb-1">{skill.title}</div>
          <div className="text-sm opacity-90 mb-4">
            {skill.finished
              ? `All lessons done · ${skill.crowns} crown${skill.crowns === 1 ? '' : 's'}`
              : `Lesson ${Math.min(skill.lessonsCompleted + 1, skill.totalLessons)} of ${skill.totalLessons}`}
          </div>
          {!skill.finished && skill.activeLessonId && (
            <button
              type="button"
              onClick={() => onStart(skill.activeLessonId!)}
              className="duo-btn duo-btn-white w-full py-3.5 text-base mb-2"
            >
              {skill.lessonsCompleted > 0 ? 'Continue' : 'Start'} +15 XP
            </button>
          )}
          {skill.finished && skill.lessons[0] && (
            <>
              <button
                type="button"
                onClick={() => onPractice(skill.lessons[0].id)}
                className="duo-btn duo-btn-white w-full py-3.5 text-base mb-2"
              >
                Practice • +1 heart, +5 XP
              </button>
              <button
                type="button"
                onClick={() => onLegendary(skill.lessons[0].id)}
                className="w-full py-3.5 text-base rounded-2xl font-bold uppercase tracking-wider text-white"
                style={{ background: 'linear-gradient(90deg,#ce82ff,#1cb0f6)', boxShadow: '0 4px 0 #6b3ecf' }}
              >
                Legendary • +40 XP
              </button>
            </>
          )}
          {!skill.finished && !skill.activeLessonId && (
            <div className="text-sm font-bold opacity-90">No lesson available yet</div>
          )}
        </div>
      </motion.div>
    </>,
    document.body,
  )
}

/** Math topic path — levels + chests matching Duolingo Math screenshots */
function MathTopicPath({
  topic,
  course,
  onStartLesson,
  onBackToGrades,
}: {
  topic: SelectedMathTopic
  course: Course
  onStartLesson: (id: string) => void
  onBackToGrades: () => void
}) {
  const skill = course.units.flatMap((u) => u.skills).find((s) => s.id === topic.skillId)
  const lessonDone = skill?.lessons.some((l) => l.id === topic.lessonId && l.completed)
  const color = topic.color || '#58cc02'
  const colorDark = color === '#58cc02' ? '#58a700' : color === '#1cb0f6' ? '#1899d6' : '#e68a00'

  const nodes: { kind: PathNodeKind; state: 'active' | 'done' | 'locked'; action?: boolean; stars?: boolean }[] = [
    { kind: 'star', state: lessonDone ? 'done' : 'active', action: true },
    { kind: 'star', state: 'locked' },
    { kind: 'chest', state: 'locked' },
    { kind: 'star', state: 'locked' },
    { kind: 'clock', state: 'locked', stars: true },
    { kind: 'chest', state: 'locked' },
    { kind: 'trophy', state: 'locked' },
  ]

  return (
    <div className="max-w-xl mx-auto pb-28 relative px-2 sm:px-0">
      <button
        onClick={onBackToGrades}
        className="duo-btn rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 w-full flex flex-col text-left text-white mb-10 sm:mb-14"
        style={{ background: color, boxShadow: `0 5px 0 0 ${colorDark}` }}
      >
        <span className="text-sm font-bold opacity-90 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> GRADE {topic.grade}
        </span>
        <span className="text-xl sm:text-2xl font-black">{topic.title}</span>
      </button>

      <div className="flex flex-col items-center gap-14 sm:gap-16 relative path-track">
        {nodes.map((n, idx) => {
          const offsetDesktop = OFFSETS[idx % OFFSETS.length]
          const offsetMobile = OFFSETS_MOBILE[idx % OFFSETS_MOBILE.length]
          // Sit beside the second star (idx 1) — not on a chest early-return
          const showMascot = idx === 1

          if (n.kind === 'chest') {
            return (
              <div
                key={idx}
                className="relative w-full flex justify-center path-node"
                style={{ ['--ox' as string]: `${offsetDesktop}px`, ['--ox-m' as string]: `${offsetMobile}px` }}
              >
                <div className="path-offset">
                  <PathChest locked opened={false} />
                </div>
              </div>
            )
          }

          return (
            <div key={idx} className="relative w-full flex justify-center path-node"
              style={{ ['--ox' as string]: `${offsetDesktop}px`, ['--ox-m' as string]: `${offsetMobile}px` }}>
              {showMascot && (
                <div
                  className="absolute z-[5] top-0 path-mascot"
                  style={{ transform: `translateX(${offsetDesktop + 110}px)` }}
                >
                  <div className="relative pointer-events-none">
                    <DuoOnClock size={210} />
                    <DuoPencilSticker size={64} className="absolute -left-12 top-28 opacity-95 hidden sm:block" />
                  </div>
                </div>
              )}
              <div className="path-offset">
                <PathCircle
                  state={n.state}
                  color={color}
                  colorDark={colorDark}
                  icon={n.kind}
                  isCurrent={n.state === 'active'}
                  crowns={n.state === 'done' ? (skill?.crowns || 1) : (n.stars ? 0 : 0)}
                  lessonProgress={n.state === 'done' ? 1 : n.state === 'active' ? 0.35 : 0}
                  onClick={n.action ? () => onStartLesson(topic.lessonId) : undefined}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function SkillTree({
  course,
  mathTopic,
  onStartLesson,
  onStartPractice,
  onStartLegendary,
  onBackToGrades,
}: {
  course: Course
  mathTopic?: SelectedMathTopic | null
  onStartLesson: (id: string) => void
  onStartPractice: (id: string) => void
  onStartLegendary: (id: string) => void
  onBackToGrades?: () => void
}) {
  const [openSkillId, setOpenSkillId] = useState<string | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  function toggleSkill(skillId: string, el: HTMLElement | null) {
    if (openSkillId === skillId) {
      setOpenSkillId(null)
      setAnchorRect(null)
      return
    }
    setOpenSkillId(skillId)
    setAnchorRect(el?.getBoundingClientRect() ?? null)
  }

  if (course.languageCode === 'math' && mathTopic && onBackToGrades) {
    return (
      <MathTopicPath
        topic={mathTopic}
        course={course}
        onStartLesson={onStartLesson}
        onBackToGrades={onBackToGrades}
      />
    )
  }

  let currentSkillId: string | null = null
  for (const u of course.units) {
    for (const s of u.skills) {
      if (s.unlocked && !s.finished && !currentSkillId) currentSkillId = s.id
    }
  }

  let globalIdx = 0

  return (
    <div className="max-w-xl mx-auto pb-28 relative px-2 sm:px-0">
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-4xl">{course.flag}</span>
        <div>
          <div className="text-2xl font-black ink leading-tight">{course.language}</div>
          <div className="text-sm font-bold ink-3">Your learning path</div>
        </div>
      </div>

      {course.units.map((unit) => (
        <div key={unit.id} className="mb-16 sm:mb-20 relative">
          <div
            className="rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between mb-10 sm:mb-12 mx-1 sm:mx-2 text-white"
            style={{ background: unit.color, boxShadow: `0 5px 0 0 ${unit.colorDark}` }}
          >
            <div>
              <div className="text-sm font-bold opacity-90">{unit.title}</div>
              <div className="text-lg sm:text-xl font-black">{unit.subtitle}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-14 sm:gap-16 relative">
            {unit.skills.map((s, idx) => {
              const nodeIdx = globalIdx++
              const offsetDesktop = OFFSETS[nodeIdx % OFFSETS.length]
              const offsetMobile = OFFSETS_MOBILE[nodeIdx % OFFSETS_MOBILE.length]
              const state = s.finished ? 'done' : s.unlocked ? 'active' : 'locked'
              const showMascot = s.id === currentSkillId
              const showChest = idx > 0 && idx % 2 === 1

              return (
                <div
                  key={s.id}
                  className={cn(
                    'relative w-full flex justify-center path-node',
                    openSkillId === s.id && 'z-[100]',
                  )}
                  style={{ ['--ox' as string]: `${offsetDesktop}px`, ['--ox-m' as string]: `${offsetMobile}px` }}
                >
                  {showChest && (
                    <div className="absolute -top-10 z-[5] hidden sm:block" style={{ transform: `translateX(${-offsetDesktop * 0.55 - 64}px)` }}>
                      <PathChest locked={!s.unlocked} opened={!!unit.skills[idx - 1]?.finished} />
                    </div>
                  )}
                  {showMascot && openSkillId !== s.id && (
                    <div
                      className="absolute top-0 z-[5] path-mascot pointer-events-none"
                      style={{ transform: `translateX(${offsetDesktop + 110}px)` }}
                    >
                      <DuoOnClock size={200} />
                    </div>
                  )}
                  <div className="relative flex flex-col items-center path-offset">
                    <PathCircle
                      state={state as 'active' | 'done' | 'locked'}
                      color={unit.color}
                      colorDark={unit.colorDark}
                      icon={s.icon || 'star'}
                      isCurrent={s.id === currentSkillId && openSkillId !== s.id}
                      crowns={s.crowns || 0}
                      lessonProgress={s.totalLessons ? s.lessonsCompleted / s.totalLessons : 0}
                      onClick={(e) => {
                        if (!s.unlocked) return
                        toggleSkill(s.id, e.currentTarget)
                      }}
                    />
                    <div className="mt-1 text-center">
                      <div className={cn('font-black text-sm uppercase tracking-wide', state === 'locked' ? 'ink-3' : 'ink')}>{s.title}</div>
                      {state !== 'locked' && (
                        <div className="text-[10px] font-bold ink-3 mt-0.5">
                          {s.finished ? `${s.crowns} crown${s.crowns === 1 ? '' : 's'}` : `${s.lessonsCompleted}/${s.totalLessons}`}
                        </div>
                      )}
                    </div>
                    {openSkillId === s.id && (
                      <SkillPopover
                        skill={s}
                        unitColor={unit.color}
                        unitColorDark={unit.colorDark}
                        anchorRect={anchorRect}
                        onClose={() => { setOpenSkillId(null); setAnchorRect(null) }}
                        onStart={(lid) => { setOpenSkillId(null); setAnchorRect(null); onStartLesson(lid) }}
                        onPractice={(lid) => { setOpenSkillId(null); setAnchorRect(null); onStartPractice(lid) }}
                        onLegendary={(lid) => { setOpenSkillId(null); setAnchorRect(null); onStartLegendary(lid) }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="text-center ink-3 py-8 font-bold">
        <Zap className="w-8 h-8 mx-auto mb-2" /> More units coming soon!
      </div>
    </div>
  )
}
