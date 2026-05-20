'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

type Props = {
  images: { url: string }[]
  serviceName: string
}

export default function ServiceImageCarousel({ images, serviceName }: Props) {
  const [current, setCurrent] = useState(0)
  const startX = useRef<number | null>(null)

  if (!images.length) return (
    <div className="h-44 rounded-t-2xl bg-gradient-to-br from-[var(--color-primary-light)]/30 to-[var(--color-lavanda)]/20 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--color-primary-dark)]" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </div>
    </div>
  )

  return (
    <div
      className="relative overflow-hidden rounded-t-2xl h-44 bg-[var(--color-surface-container-low)] select-none touch-pan-y"
      onTouchStart={e => { startX.current = e.touches[0]!.clientX }}
      onTouchEnd={e => {
        if (startX.current === null) return
        const diff = startX.current - e.changedTouches[0]!.clientX
        if (Math.abs(diff) > 40) {
          if (diff > 0) setCurrent(c => Math.min(c + 1, images.length - 1))
          else setCurrent(c => Math.max(c - 1, 0))
        }
        startX.current = null
      }}
    >
      {/* Track */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${current * 100}%)`, width: `${images.length * 100}%` }}
      >
        {images.map((img, i) => (
          <div key={i} className="relative h-full shrink-0" style={{ width: `${100 / images.length}%` }}>
            <Image
              src={img.url}
              alt={`${serviceName} — trabajo ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Foto ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={[
                'w-1.5 h-1.5 rounded-full transition-all',
                i === current
                  ? 'bg-[var(--color-primary)] scale-125 shadow-sm'
                  : 'bg-white/70 hover:bg-white',
              ].join(' ')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
