'use client'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const MathDuoRiveInner = dynamic(() => import('./MathDuoRiveInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 rounded-full bg-duo-green animate-pulse" />
    </div>
  ),
})

/** Official Duolingo Math path character (.riv) — Duo on clock */
export default function MathDuoRive({
  size = 200,
  className,
  interactive = true,
}: {
  size?: number
  className?: string
  interactive?: boolean
}) {
  return (
    <div
      className={cn('select-none', !interactive && 'pointer-events-none', className)}
      style={{ width: size, height: size }}
      aria-hidden={!interactive}
    >
      <MathDuoRiveInner />
    </div>
  )
}
