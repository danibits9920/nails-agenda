'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Activa las entradas al hacer scroll de todo lo marcado con `data-reveal`.
 *
 * El contenido es visible por defecto: sólo se esconde cuando este script
 * marca <html> con `js-reveal`. Si JavaScript falla, la página se ve entera.
 * Cada elemento se anima una sola vez.
 */
export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('js-reveal')

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-inview', '')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    const scan = () =>
      document.querySelectorAll('[data-reveal]:not([data-inview])').forEach(el => io.observe(el))

    scan()
    // Las listas que llegan después (filtros, datos del servidor) también entran.
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { io.disconnect(); mo.disconnect() }
  }, [pathname])

  return null
}
