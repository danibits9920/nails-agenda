'use client'
import { useEffect } from 'react'
import { AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[var(--color-error-bg)] border border-[var(--color-error)]/30 flex items-center justify-center mx-auto">
          <AlertCircle size={24} className="text-[var(--color-error-text)]" />
        </div>
        <div>
          <h1 className="font-display text-page text-[var(--color-navy)] mb-1">
            Error en el panel
          </h1>
          <p className="text-sm text-[var(--color-ink-secondary)]">
            No se pudo cargar esta sección. Suele resolverse al reintentar; si vuelve a pasar, entra desde el resumen.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-xs font-mono text-[var(--color-error-text)] bg-[var(--color-error-bg)] px-3 py-2 rounded-lg text-left break-all">
              {error.message}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-11 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-all shadow-sm"
          >
            <RefreshCw size={13} /> Intentar de nuevo
          </button>
          <Link
            href={`/${process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin'}/dashboard`}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-11 bg-[var(--color-surface-container-low)] text-[var(--color-ink-secondary)] text-sm font-semibold rounded-full hover:bg-[var(--color-border)] transition-colors"
          >
            <LayoutDashboard size={13} aria-hidden /> Resumen
          </Link>
        </div>
      </div>
    </div>
  )
}
