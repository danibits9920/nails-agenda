'use client'
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { toggleMaintenance } from '@/app/actions/config'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function MaintenanceToggle({ isOn }: { isOn: boolean }) {
  const [pending, start] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function apply(next: boolean) {
    setConfirming(false)
    start(async () => {
      const result = await toggleMaintenance(next)
      if (result?.error) toast.error(result.error)
      else toast.success(next
        ? 'Modo mantenimiento activado · el sitio público está en pausa'
        : 'Modo mantenimiento desactivado · el sitio ya recibe reservas')
    })
  }

  function handleClick() {
    // Apagarlo devuelve el sitio a la normalidad: eso no necesita permiso.
    // Encenderlo deja a toda clienta que entre viendo una página de pausa,
    // y era un solo toque sin vuelta atrás visible.
    if (isOn) apply(false)
    else setConfirming(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={pending}
        role="switch"
        aria-checked={isOn}
        aria-label="Modo mantenimiento"
        className={[
          'tap-halo relative shrink-0 w-14 h-7 rounded-full border transition-colors duration-200',
          'focus:',
          'disabled:cursor-not-allowed',
          // Encendido usa el acento "pendiente": mantenimiento es una pausa,
          // no un éxito. Apagado lleva borde propio porque un relleno claro
          // sin borde no alcanza 3:1 contra la tarjeta blanca (WCAG 1.4.11).
          isOn
            ? 'bg-[var(--color-status-pending-accent)] border-transparent'
            : 'bg-[var(--color-track-off)] border-[var(--color-track-border)]',
        ].join(' ')}
      >
        {pending
          ? <Loader2 size={14} className="absolute inset-0 m-auto animate-spin text-white" aria-hidden />
          : (
            <span aria-hidden className={[
              'pointer-events-none absolute top-[3px] left-[3px]',
              'h-[22px] w-[22px] rounded-full bg-white shadow-sm',
              'transition-transform duration-200',
              isOn ? 'translate-x-7' : 'translate-x-0',
            ].join(' ')} />
          )
        }
      </button>

      <ConfirmModal
        open={confirming}
        pending={pending}
        tone="caution"
        title="¿Poner el sitio en mantenimiento?"
        description="Cualquiera que entre a la web verá una página de pausa y no podrá reservar. El panel sigue funcionando y puedes reactivarlo desde aquí cuando quieras."
        confirmLabel="Pausar el sitio"
        cancelLabel="Dejarlo activo"
        onConfirm={() => apply(true)}
        onCancel={() => setConfirming(false)}
      />
    </>
  )
}
