'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const REDUCE = '(prefers-reduced-motion: reduce)'

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCE)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function canPlay() {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection?.saveData
  return !window.matchMedia(REDUCE).matches && !saveData
}

/**
 * Video de portada.
 *
 * Arranca desenfocado sobre su propio póster y se enfoca cuando el primer
 * fotograma está listo: la imagen "entra en foco" en vez de aparecer de golpe.
 *
 * - Sin sonido, en bucle e `playsInline` para que iOS no lo abra a pantalla
 *   completa.
 * - Se pausa cuando sale de pantalla o la pestaña queda oculta: un bucle que
 *   nadie ve no debe gastar batería.
 * - Con movimiento reducido o ahorro de datos no se reproduce: queda el póster.
 */
export default function HeroVideo({ poster, sources }: {
  poster: string
  sources: { src: string; type: string }[]
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  // En el servidor siempre es false: el HTML inicial lleva sólo el póster.
  const allowed = useSyncExternalStore(subscribeMotion, canPlay, () => false)

  useEffect(() => {
    const video = ref.current
    if (!video || !allowed) return

    let visible = true
    const sync = () => {
      if (visible && !document.hidden) video.play().catch(() => {})
      else video.pause()
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync() })
    io.observe(video)
    document.addEventListener('visibilitychange', sync)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [allowed])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* El póster siempre está debajo: si el video no llega, la portada no queda vacía. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        fetchPriority="high"
        className="hero-media absolute inset-0 h-full w-full object-cover"
        data-ready="true"
      />
      {allowed && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={poster}
          onLoadedData={() => setReady(true)}
          className="hero-media absolute inset-0 h-full w-full object-cover"
          data-ready={ready}
        >
          {sources.map(s => <source key={s.src} src={s.src} type={s.type} />)}
        </video>
      )}
    </div>
  )
}
