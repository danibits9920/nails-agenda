import { createClient } from '@/lib/supabase/server'
import { AppointmentBadge, PaymentBadge } from '@/components/ui/status-badges'
import { formatCLP, formatTime } from '@/lib/utils'
import { Calendar, Clock, CreditCard, Users } from 'lucide-react'
import Link from 'next/link'
import type { AppointmentStatus } from '@/types/database'
import { todayInBusinessTz, startOfMonthInBusinessTz, hourInBusinessTz, longDateInBusinessTz } from '@/lib/tz'

export default async function DashboardPage() {
  const supabase = await createClient()
  // "Hoy" es hoy en el salón, no en UTC: el servidor corre tres o cuatro
  // horas por delante de Chile y cada tarde esta página mostraba las citas
  // del día siguiente bajo el título "Citas de hoy".
  const today = todayInBusinessTz()
  const startOfMonth = startOfMonthInBusinessTz()

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
      .gte('created_at', startOfMonth),
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth),
  ])

  const revenue = monthPayments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const hour = hourInBusinessTz()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="p-5 md:p-8 space-y-8">
      {/* Saludo: el mismo gesto de la portada, en pequeño. */}
      <div className="relative isolate overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-primary)]/20 bg-white px-6 py-7 md:px-8 md:py-9">
        <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[var(--color-primary-light)]/35 blur-3xl -z-10" />
        <div aria-hidden className="absolute -bottom-28 right-40 w-64 h-64 rounded-full bg-[var(--color-lavanda)]/25 blur-3xl -z-10" />
        <h1 className="font-display text-page text-[var(--color-navy)]">
          <span className="line-mask"><span className="line-rise" style={{ '--i': -1 } as React.CSSProperties}>{greeting}, Yurany</span></span>
        </h1>
        <p className="hero-fade mt-2 text-sm font-semibold text-[var(--color-ink-secondary)] capitalize" style={{ '--i': -4 } as React.CSSProperties}>
          {longDateInBusinessTz()}
        </p>
      </div>

      <div className="stagger grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard i={0} icon={Calendar}   label="Citas hoy"        value={todayApts?.length ?? 0} accent="primary" />
        <StatCard i={1} icon={Clock}      label="Por confirmar"    value={pendingCount ?? 0}       accent="warning" alert={(pendingCount ?? 0) > 0} />
        <StatCard i={2} icon={CreditCard} label="Ingresos del mes" value={formatCLP(revenue)}      accent="success" />
        <StatCard i={3} icon={Users}      label="Clientes nuevos del mes"  value={newClients ?? 0}         accent="lavanda" />
      </div>

      <div className="page-enter bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)]" style={{ animationDelay: '220ms' }}>
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="font-display text-section text-[var(--color-navy)]">Citas de hoy</h2>
          <Link href={`/${process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin'}/citas`} className="group inline-flex items-center gap-1 text-sm font-bold text-[var(--color-primary-dark)] hover:text-[var(--color-navy)] transition-colors">
            Ver todas <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {!todayApts?.length ? (
          <div className="px-6 py-12 text-center text-sm font-medium text-[var(--color-ink-muted)]">
            No hay citas programadas para hoy.
          </div>
        ) : (
          <div className="stagger divide-y divide-[var(--color-border-soft)]">
            {todayApts.map((apt, i) => {
              const client = apt.clients as { id: string; name: string } | null
              const service = apt.services as { name: string } | null
              return (
                <div key={apt.id} style={{ '--i': i + 4 } as React.CSSProperties} className="px-6 py-4.5 flex items-center gap-4 hover:bg-[var(--color-surface-raised)] transition-colors">
                  <div className="text-center w-14 shrink-0">
                    <p className="text-sm font-bold text-[var(--color-navy)] tabular-nums">{formatTime(apt.start_time)}</p>
                    <p className="text-xs text-[var(--color-ink-secondary)] font-medium tabular-nums">{formatTime(apt.end_time)}</p>
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

function StatCard({ i, icon: Icon, label, value, accent, alert }: {
 i: number
 icon: React.ComponentType<{ size?: number; className?: string }>
 label: string
 value: string | number
 accent: 'primary' | 'warning' | 'success' | 'lavanda'
  alert?: boolean
}) {
  const iconStyle = {
 primary: 'bg-[var(--color-primary-light)]/40 text-[var(--color-primary-dark)]',
 warning: 'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending-text)]',
 success: 'bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-text)]',
 lavanda: 'bg-[var(--color-lavanda)]/40 text-[var(--color-lavanda-dark)]'
  }
  return (
    <div style={{ '--i': i } as React.CSSProperties} className={`group bg-[var(--color-surface)] rounded-[var(--radius-xl)] border p-5 md:p-6 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-raised)] ${alert ? 'border-[var(--color-status-pending-accent)]' : 'border-[var(--color-border)]'}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-eyebrow text-[var(--color-ink-secondary)] uppercase">{label}</span>
        <div className={`w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-110 group-hover:-rotate-6 ${iconStyle[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-metric tabular-nums text-[var(--color-navy)]">{value}</p>
      {alert && (
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-status-pending-text)] mt-1 font-semibold">
          {/* Punto que late: hay algo esperando a Yurany. */}
          <span aria-hidden className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-[var(--color-status-pending-accent)] animate-ping opacity-60" />
            <span className="relative w-2 h-2 rounded-full bg-[var(--color-status-pending-accent)]" />
          </span>
          Esperando tu confirmación
        </p>
      )}
    </div>
  )
}
