'use client'
import { useActionState, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cancelarCita } from '@/app/actions/gestionar'

/**
 * Cancelar pide una segunda confirmación en la misma tarjeta (sin diálogos
 * del navegador): es la única acción que la clienta no puede deshacer sola.
 */
export default function GestionarAcciones({ token }: { token: string }) {
  const [state, action, pending] = useActionState(cancelarCita, null)
  const [confirmando, setConfirmando] = useState(false)

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="token" value={token} />

      {state?.error && (
        <p className="text-sm text-[var(--color-error)] bg-[var(--color-error-bg)] px-3 py-2 rounded-[var(--radius-sm)]">{state.error}</p>
      )}

      <button
        type="submit" name="cambiar" value="1" disabled={pending}
        className="press w-full py-3.5 bg-[var(--color-navy)] text-white text-[15px] font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-60"
      >
        Cambiar a otra hora
      </button>

      {confirmando ? (
        <div className="rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-surface)] p-4 space-y-3">
          <p className="text-sm text-[var(--color-ink-secondary)] text-center">¿Seguro que quieres cancelar tu cita?</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirmando(false)} disabled={pending}
              className="press flex-1 py-3 rounded-full border border-[var(--color-border)] text-sm font-semibold text-[var(--color-navy)]">
              No, mantenerla
            </button>
            <button type="submit" disabled={pending}
              className="press flex-1 py-3 rounded-full bg-[var(--color-error)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {pending && <Loader2 size={14} className="animate-spin" />} Sí, cancelar
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirmando(true)}
          className="w-full py-3 text-sm font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-error)] transition-colors">
          Cancelar mi cita
        </button>
      )}

      <p className="text-xs text-center text-[var(--color-ink-muted)]">
        Al cambiar de hora, la actual se libera y eliges una nueva del mismo servicio.
      </p>
    </form>
  )
}
