'use client'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Check } from 'lucide-react'
import DuoOwl from './DuoOwl'
import AnimatedWelcomeDuo from './AnimatedWelcomeDuo'
import { unlockAudio, playClickSound } from '@/lib/audio'
import type { Course } from '@/lib/types'

export const ONBOARDING_KEY = 'duo-onboarding-v1'

export interface OnboardingData {
  languageCode: string
  reason: string
  country: string
  goalMinutes: number
  goalXp: number
  completedAt: string
}

const LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'math', name: 'Math', flag: '🔢' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
]

const REASONS = [
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'family', label: 'Family & friends', icon: '👨‍👩‍👧' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'brain', label: 'Support brain health', icon: '🧠' },
  { id: 'fun', label: 'Just for fun', icon: '🎉' },
  { id: 'school', label: 'School', icon: '🎓' },
]

const GOALS = [
  { minutes: 5, xp: 10, label: 'Casual', icon: '🙂' },
  { minutes: 10, xp: 20, label: 'Regular', icon: '😃' },
  { minutes: 15, xp: 30, label: 'Serious', icon: '🤩' },
  { minutes: 20, xp: 50, label: 'Intense', icon: '🔥' },
]

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Brazil', 'Mexico', 'Japan', 'South Korea', 'China',
  'Russia', 'Netherlands', 'Portugal', 'Argentina', 'Indonesia', 'Turkey',
  'Nigeria', 'South Africa', 'Egypt', 'Pakistan', 'Bangladesh', 'Philippines',
  'Vietnam', 'Thailand', 'Poland', 'Sweden', 'Norway', 'Ireland', 'New Zealand',
  'Singapore', 'United Arab Emirates', 'Saudi Arabia', 'Israel', 'Greece',
  'Switzerland', 'Belgium',
].map((name) => ({ name, flag: countryFlag(name) }))

function countryFlag(name: string): string {
  const map: Record<string, string> = {
    India: '🇮🇳', 'United States': '🇺🇸', 'United Kingdom': '🇬🇧', Canada: '🇨🇦',
    Australia: '🇦🇺', Germany: '🇩🇪', France: '🇫🇷', Spain: '🇪🇸', Italy: '🇮🇹',
    Brazil: '🇧🇷', Mexico: '🇲🇽', Japan: '🇯🇵', 'South Korea': '🇰🇷', China: '🇨🇳',
    Russia: '🇷🇺', Netherlands: '🇳🇱', Portugal: '🇵🇹', Argentina: '🇦🇷',
    Indonesia: '🇮🇩', Turkey: '🇹🇷', Nigeria: '🇳🇬', 'South Africa': '🇿🇦',
    Egypt: '🇪🇬', Pakistan: '🇵🇰', Bangladesh: '🇧🇩', Philippines: '🇵🇭',
    Vietnam: '🇻🇳', Thailand: '🇹🇭', Poland: '🇵🇱', Sweden: '🇸🇪', Norway: '🇳🇴',
    Ireland: '🇮🇪', 'New Zealand': '🇳🇿', Singapore: '🇸🇬',
    'United Arab Emirates': '🇦🇪', 'Saudi Arabia': '🇸🇦', Israel: '🇮🇱',
    Greece: '🇬🇷', Switzerland: '🇨🇭', Belgium: '🇧🇪',
  }
  return map[name] || '🌍'
}

const LOADING_LINES = [
  'Picking fun lessons for you…',
  'Sharpening Duo\u2019s pencils…',
  'Warming up your streak…',
  'Placing skills on your path…',
  'Almost there…',
]

const STEPS = ['welcome', 'language', 'reason', 'country', 'goal', 'building', 'ready'] as const
type Step = typeof STEPS[number]

export default function Onboarding({ onComplete }: { course?: Course | null; onComplete: (data: OnboardingData) => void }) {
  const [step, setStep] = useState(0)
  const [languageCode, setLanguageCode] = useState('')
  const [reason, setReason] = useState('')
  const [country, setCountry] = useState('')
  const [query, setQuery] = useState('')
  const [goalIdx, setGoalIdx] = useState(1)
  const [loadingLine, setLoadingLine] = useState(0)

  const current: Step = STEPS[step]
  const filteredCountries = useMemo(() => {
    if (!query.trim()) return COUNTRIES
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  const activeLanguage = LANGUAGES.find((l) => l.code === languageCode) || LANGUAGES[0]

  // Building step: cycle lines, then advance (with stuck fallback)
  useEffect(() => {
    if (current !== 'building') return
    setLoadingLine(0)
    let i = 0
    const lineTimer = setInterval(() => {
      i += 1
      setLoadingLine(Math.min(i, LOADING_LINES.length - 1))
    }, 550)
    const advance = setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), LOADING_LINES.length * 550 + 400)
    const safety = setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 6000)
    return () => {
      clearInterval(lineTimer)
      clearTimeout(advance)
      clearTimeout(safety)
    }
  }, [current])

  function goNext() {
    unlockAudio()
    playClickSound()
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goBack() {
    playClickSound()
    setStep((s) => Math.max(s - 1, 0))
  }

  /** Select an answer — highlight, then auto-advance (Duolingo-style). */
  function pickAndAdvance(apply: () => void) {
    unlockAudio()
    playClickSound()
    apply()
    window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 280)
  }

  function finish() {
    unlockAudio()
    playClickSound()
    const g = GOALS[goalIdx]
    const data: OnboardingData = {
      languageCode: activeLanguage.code === 'math' ? 'math' : (languageCode || 'es'),
      reason,
      country,
      goalMinutes: g.minutes,
      goalXp: g.xp,
      completedAt: new Date().toISOString(),
    }
    try { localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data)) } catch { /* ignore */ }
    onComplete(data)
  }

  const canContinue: Record<Step, boolean> = {
    welcome: true,
    language: !!languageCode,
    reason: !!reason,
    country: !!country,
    goal: true,
    building: false,
    ready: true,
  }

  const progressPct = Math.min(100, (step / (STEPS.length - 2)) * 100)

  return (
    <div className="fixed inset-0 z-[60] surface flex flex-col">
      {current !== 'welcome' && current !== 'building' && current !== 'ready' && (
        <div className="px-4 md:px-8 pt-5 pb-2 flex items-center gap-4 max-w-2xl w-full mx-auto">
          <button type="button" onClick={goBack} aria-label="Back" className="text-2xl font-black ink-3 hover:ink px-2 select-none">
            ‹
          </button>
          <div className="flex-1 h-4 bg-outline rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-duo-green rounded-full"
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-4 md:px-8 overflow-y-auto py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full max-w-2xl"
          >
            {current === 'welcome' && <WelcomeStep />}
            {current === 'language' && (
              <LanguageStep
                languages={LANGUAGES}
                selected={languageCode}
                onSelect={(code) => pickAndAdvance(() => setLanguageCode(code))}
              />
            )}
            {current === 'reason' && (
              <ReasonStep
                language={activeLanguage.name}
                selected={reason}
                onSelect={(id) => pickAndAdvance(() => setReason(id))}
              />
            )}
            {current === 'country' && (
              <CountryStep
                query={query}
                setQuery={setQuery}
                countries={filteredCountries}
                selected={country}
                onSelect={(name) => pickAndAdvance(() => setCountry(name))}
              />
            )}
            {current === 'goal' && (
              <GoalStep
                language={activeLanguage.name}
                selectedIdx={goalIdx}
                onSelect={(i) => { unlockAudio(); playClickSound(); setGoalIdx(i) }}
              />
            )}
            {current === 'building' && (
              <BuildingStep language={activeLanguage.name} line={LOADING_LINES[loadingLine]} />
            )}
            {current === 'ready' && (
              <ReadyStep language={activeLanguage.name} country={country} goal={GOALS[goalIdx]} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {current !== 'building' && (
        <div className="border-t-2 border-outline p-4">
          <div className="max-w-2xl mx-auto flex justify-end">
            {current === 'ready' ? (
              <button type="button" onClick={finish} className="duo-btn duo-btn-green px-10 py-3 w-full sm:w-auto">
                Start learning
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue[current]}
                className="duo-btn duo-btn-green px-10 py-3 w-full sm:w-auto"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}

      {/* Escape hatch if building ever hangs */}
      {current === 'building' && (
        <div className="absolute bottom-6 inset-x-0 flex justify-center">
          <button type="button" onClick={goNext} className="text-sm font-bold ink-3 underline">
            Skip
          </button>
        </div>
      )}
    </div>
  )
}

function WelcomeStep() {
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <AnimatedWelcomeDuo size={188} />
      <h1 className="text-3xl md:text-4xl font-black ink">
        Hi there! I&apos;m Duo.
      </h1>
      <p className="ink-3 font-bold text-lg max-w-md">
        The free, fun, and effective way to learn a language — or math. Let&apos;s set up your course.
      </p>
    </div>
  )
}

function LanguageStep({ languages, selected, onSelect }: {
  languages: typeof LANGUAGES; selected: string; onSelect: (code: string) => void
}) {
  const available = new Set(['es', 'math'])
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-black ink text-center mb-2">I want to learn…</h2>
      <p className="ink-3 font-bold text-center mb-6">Pick Spanish or Math to continue</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {languages.map((l) => {
          const ok = available.has(l.code)
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => ok && onSelect(l.code)}
              disabled={!ok}
              className={`option-card flex flex-col items-center gap-2 py-5 relative ${selected === l.code ? 'selected' : ''} ${!ok ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-4xl">{l.flag}</span>
              <span className="font-black">{l.name}</span>
              {!ok && <span className="text-[10px] uppercase ink-3 absolute top-2 right-2">Soon</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ReasonStep({ language, selected, onSelect }: {
  language: string; selected: string; onSelect: (id: string) => void
}) {
  const label = language === 'Math' ? 'Why are you practicing Math?' : `Why are you learning ${language}?`
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-black ink text-center mb-6">{label}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {REASONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect(r.id)}
            className={`option-card flex items-center gap-3 py-4 text-left ${selected === r.id ? 'selected' : ''}`}
          >
            <span className="text-2xl">{r.icon}</span>
            <span className="font-black">{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function CountryStep({ query, setQuery, countries, selected, onSelect }: {
  query: string; setQuery: (v: string) => void; countries: { name: string; flag: string }[];
  selected: string; onSelect: (name: string) => void
}) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-black ink text-center mb-2">Where are you from?</h2>
      <p className="ink-3 font-bold text-center mb-5">We&apos;ll use this for your local leaderboard &amp; streak reminders.</p>
      <div className="relative mb-4">
        <Search className="w-5 h-5 ink-3 absolute left-4 top-1/2 -translate-x-0 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-outline surface ink font-bold outline-none focus:border-duo-blue transition-colors"
        />
      </div>
      <div className="max-h-72 overflow-y-auto space-y-2 pr-1 hidden-scroll">
        {countries.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onSelect(c.name)}
            className={`option-card w-full flex items-center justify-between py-3 ${selected === c.name ? 'selected' : ''}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">{c.flag}</span>
              <span className="font-black">{c.name}</span>
            </span>
            {selected === c.name && <Check className="w-5 h-5" />}
          </button>
        ))}
        {countries.length === 0 && (
          <div className="text-center ink-3 font-bold py-6">No countries match &quot;{query}&quot;</div>
        )}
      </div>
    </div>
  )
}

function GoalStep({ language, selectedIdx, onSelect }: {
  language: string; selectedIdx: number; onSelect: (i: number) => void
}) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-black ink text-center mb-2">What&apos;s your daily goal?</h2>
      <p className="ink-3 font-bold text-center mb-6">You can always change this later in {language} class.</p>
      <div className="space-y-3">
        {GOALS.map((g, i) => (
          <button
            key={g.minutes}
            type="button"
            onClick={() => onSelect(i)}
            className={`option-card w-full flex items-center justify-between py-4 ${selectedIdx === i ? 'selected' : ''}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">{g.icon}</span>
              <span className="font-black">{g.label}</span>
            </span>
            <span className="font-bold ink-3">{g.minutes} min/day · {g.xp} XP</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function BuildingStep({ language, line }: { language: string; line: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <motion.div animate={{ rotate: [0, -8, 8, -8, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
        <DuoOwl size={140} emotion="thinking" />
      </motion.div>
      <h2 className="text-2xl md:text-3xl font-black ink">Building your {language} course</h2>
      <div className="w-full max-w-xs h-4 bg-outline rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-duo-blue rounded-full"
          initial={{ width: '5%' }}
          animate={{ width: '95%' }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="ink-3 font-bold"
        >
          {line}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

function ReadyStep({ language, country, goal }: { language: string; country: string; goal: { minutes: number; xp: number } }) {
  const dots = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      left: `${(i * 37) % 100}%`,
      top: `${20 + ((i * 19) % 40)}%`,
      color: ['#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff4b4b'][i % 5],
      delay: `${(i % 5) * 0.1}s`,
    })),
    [],
  )

  return (
    <div className="relative flex flex-col items-center text-center gap-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {dots.map((d, i) => (
          <div
            key={i}
            className="confetti-dot"
            style={{ left: d.left, top: d.top, background: d.color, animationDelay: d.delay }}
          />
        ))}
      </div>
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
        <AnimatedWelcomeDuo size={160} />
      </motion.div>
      <h1 className="text-3xl md:text-4xl font-black text-duo-green">You&apos;re all set!</h1>
      <p className="ink-3 font-bold max-w-md">
        Your {language} path is ready{country ? ` for a learner in ${country}` : ''}. Goal: {goal.minutes} min
        ({goal.xp} XP) a day. Let&apos;s go!
      </p>
    </div>
  )
}
