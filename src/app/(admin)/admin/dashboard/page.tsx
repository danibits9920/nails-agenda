import { createClient } from '@/lib/supabase/server'
import { AppointmentBadge, PaymentBadge } from '@/components/ui/Badge'
import { formatCLP, formatTime } from '@/lib/utils'
import { Calendar, Clock, CreditCard, Users } from 'lucide-react'
import Link from 'next/link'
import type { AppointmentStatus } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    { data: todayApts },
    { count: pendingCount },
    { data: monthPayments },
    { count: newClients },
  ] = await Promise.all([
    supabase
      .from('appointments')
      .select('id, start_time, end_time, status, payment_status, clients(id, name), services(name)')
      .eq('date', today)
      .not('status', 'in', '("cancelled","no_show")')
      .order('start_time'),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('payments')
      .select('amount')
      .eq('status', 'verified')
      .gte('created_at', startOfMonth.toISOString()),
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString()),
  ])

  const revenue = monthPayments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-display text-4.5xl font-bold text-[var(--color-navy)] tracking-tight">
          {greeting}, Yurany
        </h1>
        <p className="mt-1 text-sm font-semibold text-[var(--color-ink-secondary)] capitalize">
          {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard icon={Calendar}   label="Citas hoy"        value={todayApts?.length ?? 0} accent="primary" />
        <StatCard icon={Clock}      label="Por confirmar"    value={pendingCount ?? 0}       accent="warning" alert={(pendingCount ?? 0) > 0} />
        <StatCard icon={CreditCard} label="Ingresos del mes" value={formatCLP(revenue)}      accent="success" />
        <StatCard icon={Users}      label="Clientes nuevos"  value={newClients ?? 0}         accent="lavanda" />
      </div>

      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-[var(--color-navy)] tracking-tight">Citas de hoy</h2>
          <Link href="/admin/citas" className="text-sm font-bold text-[var(--color-primary-dark)] hover:text-[var(--color-navy)] transition-colors">
            Ver todas →
          </Link>
        </div>

        {!todayApts?.length ? (
          <div className="px-6 py-12 text-center text-sm font-medium text-[var(--color-ink-muted)]">
            No hay citas programadas para hoy.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border-soft)]">
            {todayApts.map((apt) => {
              const client = apt.clients as { id: string; name: string } | null
              const service = apt.services as { name: string } | null
              return (
                <div key={apt.id} className="px-6 py-4.5 flex items-center gap-4 hover:bg-[var(--color-surface-raised)] transition-all">
                  <div className="text-center w-14 shrink-0">
                    <p className="text-sm font-bold text-[var(--color-navy)]">{formatTime(apt.start_time)}</p>
                    <p className="text-xs text-[var(--color-ink-secondary)] font-medium">{formatTime(apt.end_time)}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--color-ink)] truncate">{client?.name ?? '—'}</p>
                    <p className="text-xs text-[var(--color-ink-secondary)] font-medium truncate">{service?.name ?? '—'}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <AppointmentBadge status={apt.status as AppointmentStatus} />
                    <PaymentBadge status={apt.payment_status} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent, alert }: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string | number
  accent: 'primary' | 'warning' | 'success' | 'lavanda'
  alert?: boolean
}) {
  const iconStyle = {
    primary: 'bg-[var(--color-primary-light)]/40 text-[var(--color-primary-dark)]',
    warning: 'bg-amber-100 text-amber-800',
    success: 'bg-emerald-100 text-emerald-800',
    lavanda: 'bg-[var(--color-lavanda)]/40 text-[var(--color-lavanda-dark)]'
  }
  return (
    <div className={`bg-[var(--color-surface)] rounded-[var(--radius-xl)] border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm ${alert ? 'border-amber-200' : 'border-[var(--color-border)]'}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold text-[var(--color-ink-secondary)] uppercase tracking-[0.15em]">{label}</span>
        <div className={`w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center ${iconStyle[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2.5xl font-bold text-[var(--color-navy)] tracking-tight">{value}</p>
      {alert && <p className="text-xs text-amber-600 mt-1 font-semibold">Requiere atención</p>}
    </div>
  )
}
