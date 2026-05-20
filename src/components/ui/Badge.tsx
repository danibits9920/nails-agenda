import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/types/database'

const appointmentConfig: Record<AppointmentStatus, { label: string; cls: string }> = {
  pending:     { label: 'Pendiente',  cls: 'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending-text)] border-[rgba(133,100,4,0.15)]'  },
  confirmed:   { label: 'Confirmada', cls: 'bg-[var(--color-status-confirmed-bg)] text-[var(--color-status-confirmed-text)] border-[rgba(111,66,193,0.15)]'   },
  in_progress: { label: 'En curso',   cls: 'bg-[var(--color-status-progress-bg)] text-[var(--color-status-progress-text)] border-[rgba(237,170,181,0.25)]' },
  completed:   { label: 'Completada', cls: 'bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-text)] border-[rgba(21,87,36,0.15)]'  },
  cancelled:   { label: 'Cancelada',  cls: 'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled-text)] border-[rgba(114,28,36,0.15)]'   },
  no_show:     { label: 'No asistió', cls: 'bg-[var(--color-status-noshow-bg)] text-[var(--color-status-noshow-text)] border-[rgba(56,61,65,0.15)]'    },
}

const paymentConfig: Record<string, { label: string; cls: string }> = {
  unpaid:               { label: 'Sin pagar',     cls: 'bg-[var(--color-status-cancelled-bg)] text-[var(--color-status-cancelled-text)] border-[rgba(114,28,36,0.15)]'   },
  pending_verification: { label: 'Por verificar', cls: 'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending-text)] border-[rgba(133,100,4,0.15)]'  },
  paid:                 { label: 'Pagado',        cls: 'bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-text)] border-[rgba(21,87,36,0.15)]'  },
}

const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border'

export function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  const c = appointmentConfig[status] ?? { label: status, cls: 'bg-gray-50 text-gray-400 border-gray-200' }
  return <span className={cn(base, c.cls)}>{c.label}</span>
}

export function PaymentBadge({ status }: { status: string }) {
  const c = paymentConfig[status] ?? { label: status, cls: 'bg-gray-50 text-gray-400 border-gray-200' }
  return <span className={cn(base, c.cls)}>{c.label}</span>
}
