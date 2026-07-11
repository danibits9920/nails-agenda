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
      title={isActive ? 'Desactivar' : 'Activar'}
      aria-label={isActive ? 'Desactivar servicio' : 'Activar servicio'}
      className={[
        'relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-dorado)]/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isActive ? 'bg-[var(--color-dorado)]' : 'bg-gray-200',
      ].join(' ')}
    >
      <span
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
