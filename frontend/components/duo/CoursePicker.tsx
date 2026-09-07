'use client'
import { Check, ChevronDown } from 'lucide-react'
import { MathIcon, FlagCourseIcon } from './MathIcon'
import { cn } from '@/lib/utils'

const CATALOG = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', learners: '42.2M learners' },
  { code: 'fr', name: 'French', flag: '🇫🇷', learners: '28.1M learners', soon: true },
  { code: 'chess', name: 'Chess', flag: '♟️', learners: '', soon: true, iconBg: '#58cc02' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', learners: '19.4M learners', soon: true },
  { code: 'de', name: 'German', flag: '🇩🇪', learners: '15.8M learners', soon: true },
  { code: 'math', name: 'Math', flag: '🔢', learners: '', math: true },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', learners: '8.2M learners', soon: true },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', learners: '11.0M learners', soon: true },
  { code: 'it', name: 'Italian', flag: '🇮🇹', learners: '9.1M learners', soon: true },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', learners: '12.5M learners', soon: true },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', learners: '6.4M learners', soon: true },
  { code: 'en', name: 'English', flag: '🇺🇸', learners: '51.0M learners', soon: true },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', learners: '4.8M learners', soon: true },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', learners: '7.3M learners', soon: true },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', learners: '3.1M learners', soon: true },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', learners: '2.9M learners', soon: true },
]

export default function CoursePicker({
  activeCode,
  onSelect,
  onClose,
}: {
  activeCode: string
  onSelect: (code: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[55] surface overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <button onClick={onClose} className="ink-3 font-bold mb-3 hover:ink">← Back</button>
            <h1 className="text-2xl md:text-3xl font-black ink">Courses for English Speakers</h1>
          </div>
          <button className="flex items-center gap-1 text-xs font-black uppercase tracking-wide ink-3 shrink-0 mt-8">
            I speak English <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {CATALOG.map((c) => {
            const selected = c.code === activeCode
            const disabled = !!c.soon
            return (
              <button
                key={c.code}
                disabled={disabled}
                onClick={() => {
                  if (c.code === 'math' || c.code === 'es') {
                    onSelect(c.code)
                    onClose()
                  }
                }}
                className={cn(
                  'relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-outline transition',
                  'duo-press',
                  selected && 'border-duo-green bg-duo-green/5',
                  disabled && 'opacity-55 cursor-not-allowed',
                  !disabled && 'hover:surface-2',
                )}
              >
                {selected && (
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-md bg-duo-green flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </span>
                )}
                {c.math ? (
                  <MathIcon size={56} />
                ) : (
                  <FlagCourseIcon flag={c.flag} size={56} />
                )}
                <div className="font-black ink text-lg">{c.name}</div>
                {c.learners ? (
                  <div className="text-xs font-bold ink-3">{c.learners}</div>
                ) : disabled ? (
                  <div className="text-xs font-bold ink-3">Coming soon</div>
                ) : (
                  <div className="text-xs font-bold ink-3 h-4" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
