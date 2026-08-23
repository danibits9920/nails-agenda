'use client'
import { updateAppointmentStatus } from '@/app/actions/appointments'
import { APPOINTMENT_STATUS } from '@/components/ui/status-badges'
import type { AppointmentStatus } from '@/types/database'
import { useId, useTransition } from 'react'
import { toast } from 'sonner'

const ORDER: AppointmentStatus[] = [
  'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show',
]

export default function StatusChanger({
  appointmentId,
  currentStatus,
  clientName,
}: {
  appointmentId: string
  currentStatus: AppointmentStatus
  /** Da nombre al control: sin esto el lector de pantalla anuncia seis
   *  selectores idénticos, uno por fila, sin decir de quién es cada uno. */
  clientName?: string | null
}) {
  const [pending, startTransition] = useTransition()
  const id = useId()

  function change(next: AppointmentStatus) {
    if (next === currentStatus) return
    startTransition(async () => {
      // El resultado se descartaba: una acción fallida dejaba el selector
      // volviendo solo a su valor anterior, sin ninguna explicación.
      const result = await updateAppointmentStatus(appointmentId, next)
      if (result?.error) toast.error(result.error)
      else toast.success(`Cita marcada como "${APPOINTMENT_STATUS[next].label}"`)
    })
  }

  const label = clientName
    ? `Estado de la cita de ${clientName}`
    : 'Estado de la cita'

  return (
    <>
      <label htmlFor={id} className="sr-only">{label}</label>
      <select
        id={id}
        disabled={pending}
        value={currentStatus}
        aria-busy={pending}
        onChange={(e) => change(e.target.value as AppointmentStatus)}
        className="min-h-11 text-xs border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-1.5 bg-[var(--color-surface)] text-[var(--color-ink-secondary)] focus-visible:border-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-wait cursor-pointer"
      >
        {ORDER.map(value => (
          <option key={value} value={value}>{APPOINTMENT_STATUS[value].label}</option>
        ))}
      </select>
    </>
  )
}
