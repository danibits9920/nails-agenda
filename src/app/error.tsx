'use client'
import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <AlertCircle size={24} className="text-red-600" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-[var(--color-navy)] mb-1">
            Algo salió mal
          </h1>
          <p className="text-sm text-[var(--color-ink-secondary)]">
            Ocurrió un error inesperado. Puedes intentar de nuevo.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-xs font-mono text-red-500 bg-red-50 px-3 py-2 rounded-lg text-left break-all">
              {error.message}
            </p>
          )}
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-all shadow-sm"
        >
          <RefreshCw size={14} /> Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
