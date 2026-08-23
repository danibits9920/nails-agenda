import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/types/database'

/**
 * Estado de cita — la fuente canónica de color de estado del panel.
 *
 * Antes había cuatro tablas de color distintas para el mismo dato (badge,
 * tarjeta de calendario, bloque de calendario y barra de reportes), así que
 * una cita "Confirmada" era violeta en la lista, lila en el calendario y azul
 * en los reportes. Ahora todas consumen esta tabla.
 *
 * Las clases se escriben completas a propósito: Tailwind sólo genera lo que
 * encuentra literal en el código, así que un `bg-[var(--color-status-${x})]`
 * construido en runtime no produciría ninguna regla.
 */

type StatusStyle = {
  label: string
  /** Relleno + texto + borde, para superficies que llevan texto encima. */
  surface: string
  /** El sólido del estado, como valor CSS: puntos, barras, bordes. */
  accent: string
}

export const APPOINTMENT_STATUS: Record<AppointmentStatus, StatusStyle> = {
  pending: {
    label: 'Pendiente',
    surface: 'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending-text)] border-[var(--color-status-pending-accent)]',
    accent: 'var(--color-status-pending-accent)',
  },
  confirmed: {
    label: 'Confirmada',
    surface: 'bg-[var(--color-status-confirmed-bg)] text-[var(--color-status-confirmed-text)] border-[var(--color-status-confirmed-accent)]',
    accent: 'var(--color-status-confirmed-accent)',
  },
  in_progress: {
    label: 'En curso',
    surface: 'bg-[var(--color-status-progress-bg)] text-[var(--color-status-progress-text)] border-[var(--color-status-progress-accent)]',
    accent: 'var(--color-status-progress-accent)',
  },
  completed: {
    label: 'Completada',
    surface: 'bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-text)] border-[var(--color-status-completed-accent)]',
    accent: 'var(--color-status-completed-accent)',
  },
  cancelled: {
    label: 'Cancelada',
    surface: 'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled-text)] border-[var(--color-status-cancelled-accent)]',
    accent: 'var(--color-status-cancelled-accent)',
  },
  no_show: {
    label: 'No asistió',
    surface: 'bg-[var(--color-status-noshow-bg)] text-[var(--color-status-noshow-text)] border-[var(--color-status-noshow-accent)]',
    accent: 'var(--color-status-noshow-accent)',
  },
}

const PAYMENT_STATUS: Record<string, StatusStyle> = {
  unpaid:               { ...APPOINTMENT_STATUS.cancelled, label: 'Sin pagar'     },
  pending_verification: { ...APPOINTMENT_STATUS.pending,   label: 'Por verificar' },
  paid:                 { ...APPOINTMENT_STATUS.completed, label: 'Pagado'        },
}

// Un estado sin mapear no debe parecerse a un estado válido apagado: se pinta
// en el neutro del sistema y conserva el valor crudo como etiqueta, para que
// se vea que falta mapearlo en vez de pasar por un estado real.
const UNKNOWN = APPOINTMENT_STATUS.no_show

const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border'

export function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  const s = APPOINTMENT_STATUS[status]
  return <span className={cn(base, (s ?? UNKNOWN).surface)}>{s?.label ?? status}</span>
}

export function PaymentBadge({ status }: { status: string }) {
  const s = PAYMENT_STATUS[status]
  return <span className={cn(base, (s ?? UNKNOWN).surface)}>{s?.label ?? status}</span>
}
