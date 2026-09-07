'use client'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/** Official path / UI asset helpers (SVGs + stickers from Duolingo CDN) */

export function PathStarIcon({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/icons/star.svg"
      alt=""
      width={size}
      height={size}
      className={cn('pointer-events-none select-none', className)}
      draggable={false}
    />
  )
}

export function PathTrophyIcon({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/icons/trophy.svg"
      alt=""
      width={size}
      height={size}
      className={cn('pointer-events-none select-none', className)}
      draggable={false}
    />
  )
}

export function OfficialHeart({
  className,
  size = 28,
  empty = false,
}: {
  className?: string
  size?: number
  empty?: boolean
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/hearts/heart.svg"
      alt=""
      width={size}
      height={size}
      className={cn('pointer-events-none select-none', empty && 'grayscale opacity-40', className)}
      draggable={false}
    />
  )
}

export function OfficialChest({
  locked = true,
  opened = false,
  className,
  size = 56,
}: {
  locked?: boolean
  opened?: boolean
  className?: string
  size?: number
}) {
  return (
    <div className={cn('relative', className)} style={{ width: size, height: Math.round(size * 1.125) }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/path/chest.svg"
        alt=""
        width={size}
        height={Math.round(size * 1.125)}
        className={cn(
          'pointer-events-none select-none object-contain',
          opened && 'brightness-110 saturate-150',
          locked && !opened && 'opacity-90',
        )}
        draggable={false}
      />
      {locked && !opened && (
        <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
          <span className="text-[10px] font-black ink-3 bg-white/80 dark:bg-black/40 rounded px-1">🔒</span>
        </div>
      )}
    </div>
  )
}

export function DuoJumpSticker({ size = 120, className }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/stickers/duo-jump.png"
      alt="Duo"
      width={size}
      height={size}
      className={cn('pointer-events-none select-none object-contain', className)}
      draggable={false}
    />
  )
}

export function DuoPencilSticker({ size = 96, className }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/stickers/duo-pencil.png"
      alt=""
      width={size}
      height={size}
      className={cn('pointer-events-none select-none object-contain', className)}
      draggable={false}
    />
  )
}

/** Optional next/image wrapper for static stickers when optimizing matters */
export function StickerImage({ src, alt = '', size = 96, className }: {
  src: string; alt?: string; size?: number; className?: string
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('pointer-events-none select-none object-contain', className)}
      unoptimized
    />
  )
}
