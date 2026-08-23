'use client'
import { toggleServiceActive } from '@/app/actions/services'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function ToggleActive({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(async () => {
        const result = await toggleServiceActive(id, !isActive)
        if (result?.error) toast.error(result.error)
        else toast.success(isActive ? 'Servicio desactivado' : 'Servicio activado')
      })}
      role="switch"
      aria-checked={isActive}
      aria-label="Servicio disponible para reservar"
      title={isActive ? 'Desactivar servicio' : 'Activar servicio'}
      className={[
        'tap-halo relative shrink-0 w-11 h-6 rounded-full border transition-colors duration-200',
        'focus:',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // El dorado estaba a 2.10:1 sobre blanco y además el oro sólo toca
        // el dinero: "servicio activo" es afirmativo, no una cifra.
        isActive
          ? 'bg-[var(--color-success-strong)] border-transparent'
          : 'bg-[var(--color-track-off)] border-[var(--color-track-border)]',
      ].join(' ')}
    >
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute top-[2px] left-[2px]',
          'h-5 w-5 rounded-full bg-white shadow-sm',
          'transition-transform duration-200',
          isActive ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}
