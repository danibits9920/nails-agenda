import { createClient } from '@/lib/supabase/server'
import { AppointmentBadge, PaymentBadge } from '@/components/ui/Badge'
import { formatCLP, formatDate, formatTime } from '@/lib/utils'
import Link from 'next/link'
import type { AppointmentStatus } from '@/types/database'
import StatusChanger from './StatusChanger'

type SearchParams = { status?: string; fecha?: string }

export default async function CitasPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('appointments')
    .select('id, date, start_time, end_time, status, payment_status, notes, clients(id, name, phone), services(name, price)')
    .order('date', { ascending: false })
    .order('start_time')
    .limit(60)

  if (params.status) query = query.eq('status', params.status)
  if (params.fecha)  query = query.eq('date', params.fecha)

  const { data: appointments } = await query

  const statuses: AppointmentStatus[] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-navy)]">Citas</h1>
          <p className="text-sm text-[var(--color-ink-tertiary)] mt-0.5">{appointments?.length ?? 0} registros</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterLink href="/admin/citas" active={!params.status} label="Todas" />
        {statuses.map(s => (
          <FilterLink key={s} href={`/admin/citas?status=${s}`} active={params.status === s} label={s} />
        ))}
      </div>

      {/* Lista */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden">
        {!appointments?.length ? (
          <div className="p-12 text-center text-sm text-[var(--color-ink-muted)]">
            No hay citas con estos filtros.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border-soft)]">
            {appointments.map((apt) => {
              const client = apt.clients as { id: string; name: string; phone: string | null } | null
              const service = apt.services as { name: string; price: number } | null
              return (
                <div key={apt.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--color-surface-raised)] transition-colors">
                  <div className="min-w-[100px] shrink-0">
                    <p className="text-sm font-medium text-[var(--color-navy)]">{formatDate(apt.date)}</p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      {formatTime(apt.start_time)} – {formatTime(apt.end_time)}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-ink)] truncate">
                      {client ? (
                        <Link href={`/admin/clientes/${client.id}`} className="hover:text-[var(--color-dorado)] transition-colors">
                          {client.name}
                        </Link>
                      ) : '—'}
                    </p>
                    <p className="text-sm text-[var(--color-ink-secondary)] truncate">
                      {service?.name ?? '—'} {service ? `· ${formatCLP(service.price)}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <AppointmentBadge status={apt.status as AppointmentStatus} />
                    <PaymentBadge status={apt.payment_status} />
                  </div>
                  <StatusChanger appointmentId={apt.id} currentStatus={apt.status as AppointmentStatus} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
        active
          ? 'bg-[var(--color-navy)] text-white border-[var(--color-navy)]'
          : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border)] hover:border-[var(--color-navy)]'
      }`}
    >
      {label}
    </Link>
  )
}
