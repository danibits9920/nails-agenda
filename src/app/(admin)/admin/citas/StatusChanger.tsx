'use client'
import { updateAppointmentStatus } from '@/app/actions/appointments'
import type { AppointmentStatus } from '@/types/database'
import { useTransition } from 'react'

const options: { value: AppointmentStatus; label: string }[] = [
  { value: 'pending',     label: 'Pendiente'  },
  { value: 'confirmed',   label: 'Confirmada' },
  { value: 'in_progress', label: 'En curso'   },
  { value: 'completed',   label: 'Completada' },
  { value: 'cancelled',   label: 'Cancelada'  },
  { value: 'no_show',     label: 'No asistió' },
]

export default function StatusChanger({
  appointmentId,
  currentStatus,
}: {
  appointmentId: string
  currentStatus: AppointmentStatus
}) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      disabled={pending}
      value={currentStatus}
      onChange={(e) => {
        startTransition(() => {
          updateAppointmentStatus(appointmentId, e.target.value as AppointmentStatus)
        })
      }}
      className="text-xs border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-1.5 bg-[var(--color-surface)] text-[var(--color-ink-secondary)] focus:outline-none focus:border-[var(--color-dorado)] disabled:opacity-50 cursor-pointer"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
