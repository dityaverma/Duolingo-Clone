'use client'

/** Duolingo Math course icon — blue rounded square with + − = × */
export function MathIcon({ size = 40, className = '' }: { size?: number; className?: string }) {
  const r = Math.round(size * 0.22)
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: '#1cb0f6',
        boxShadow: '0 0 0 3px var(--course-icon-ring), 0 3px 0 0 var(--course-icon-shadow)',
      }}
      aria-hidden
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <path d="M5 7h6M8 4v6" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M14 7h6" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M5 14h6M5 18h6" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M15 13.5l4 5M19 13.5l-4 5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/** Flag course icon — always light behind the flag (never black) */
export function FlagCourseIcon({ flag, size = 40 }: { flag: string; size?: number }) {
  const r = Math.round(size * 0.22)
  return (
    <div
      className="flex items-center justify-center shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: '#ffffff',
        boxShadow: '0 0 0 3px var(--course-icon-ring), 0 3px 0 0 var(--course-icon-shadow)',
        fontSize: size * 0.55,
      }}
    >
      {flag}
    </div>
  )
}
