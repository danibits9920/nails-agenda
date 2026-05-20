import { cn } from '@/lib/utils'
import type { AppointmentStatus } from '@/types/database'

const appointmentConfig: Record<AppointmentStatus, { label: string; cls: string }> = {
  pending:     { label: 'Pendiente',  cls: 'bg-amber-50  text-amber-600  border-amber-200'  },
  confirmed:   { label: 'Confirmada', cls: 'bg-blue-50   text-blue-600   border-blue-200'   },
  in_progress: { label: 'En curso',   cls: 'bg-purple-50 text-purple-600 border-purple-200' },
  completed:   { label: 'Completada', cls: 'bg-green-50  text-green-600  border-green-200'  },
  cancelled:   { label: 'Cancelada',  cls: 'bg-gray-50   text-gray-400   border-gray-200'   },
  no_show:     { label: 'No asistió', cls: 'bg-red-50    text-red-500    border-red-200'    },
}

const paymentConfig: Record<string, { label: string; cls: string }> = {
  unpaid:               { label: 'Sin pagar',     cls: 'bg-gray-50   text-gray-400   border-gray-200'   },
  pending_verification: { label: 'Por verificar', cls: 'bg-amber-50  text-amber-600  border-amber-200'  },
  paid:                 { label: 'Pagado',        cls: 'bg-green-50  text-green-600  border-green-200'  },
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
