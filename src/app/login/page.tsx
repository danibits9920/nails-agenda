'use client'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Marca */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-lavanda)] flex items-center justify-center mb-4 shadow-[0_6px_24px_rgba(237,170,181,0.45)]">
            <span className="text-2xl select-none">✦</span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-navy)]">
            Nails Art Yurany
          </h1>
          <p className="text-sm text-[var(--color-ink-tertiary)] mt-1">
            Panel de administración
          </p>
        </div>

        {/* Tarjeta */}
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-8 shadow-[var(--shadow-raised)]">
          <form action={action} className="space-y-5">

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-ink-secondary)]">
                Email
              </label>
              <input
                id="email" name="email" type="email"
                required autoComplete="email"
                placeholder="admin@ejemplo.cl"
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-dorado)] focus:ring-2 focus:ring-[var(--color-dorado)]/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-ink-secondary)]">
                Contraseña
              </label>
              <input
                id="password" name="password" type="password"
                required autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-dorado)] focus:ring-2 focus:ring-[var(--color-dorado)]/20 transition-colors"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-[var(--color-error)] bg-[var(--color-error-bg)] px-3 py-2 rounded-[var(--radius-sm)]">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 px-4 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-[var(--radius-md)] hover:bg-[var(--color-navy-light)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-1"
            >
              {pending ? 'Ingresando…' : 'Ingresar'}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-ink-muted)] mt-6">
          Panel privado · Solo personal autorizado
        </p>
      </div>
    </div>
  )
}
