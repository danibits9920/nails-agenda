'use client'
import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

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
              <Label htmlFor="email" className="text-[var(--color-ink-secondary)]">
                Email
              </Label>
              <Input
                id="email" name="email" type="email"
                required autoComplete="email"
                placeholder="admin@ejemplo.cl"
                className="h-11 bg-[var(--color-surface-raised)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[var(--color-ink-secondary)]">
                Contraseña
              </Label>
              <Input
                id="password" name="password" type="password"
                required autoComplete="current-password"
                className="h-11 bg-[var(--color-surface-raised)]"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-[var(--color-error)] bg-[var(--color-error-bg)] px-3 py-2 rounded-[var(--radius-sm)]">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full h-11 mt-1 rounded-[var(--radius-md)] bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-light)]"
            >
              {pending && <Loader2 size={14} className="animate-spin" />}
              {pending ? 'Ingresando…' : 'Ingresar'}
            </Button>

          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-ink-muted)] mt-6">
          Panel privado · Solo personal autorizado
        </p>
      </div>
    </div>
  )
}
