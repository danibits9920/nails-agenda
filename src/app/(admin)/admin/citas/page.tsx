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
  const statusLabels: Record<string, string> = {
    pending: 'Pendiente', confirmed: 'Confirmada', in_progress: 'En curso',
    completed: 'Completada', cancelled: 'Cancelada', no_show: 'No se presentó',
  }

  return (
    <div className="p-4 md:p-8 space-y-5 md:space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-4xl font-bold text-[var(--color-navy)] tracking-tight">Citas</h1>
        <p className="text-sm font-semibold text-[var(--color-ink-secondary)] mt-1">
          {appointments?.length ?? 0} registros encontrados
        </p>
      </div>

      {/* Filtros — scroll horizontal en mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-none">
        <FilterLink href="/admin/citas" active={!params.status} label="Todas" />
        {statuses.map(s => (
          <FilterLink key={s} href={`/admin/citas?status=${s}`} active={params.status === s} label={statusLabels[s] || s} />
        ))}
      </div>

      {/* Lista */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        {!appointments?.length ? (
          <div className="p-12 text-center text-sm font-medium text-[var(--color-ink-muted)]">
            No hay citas con estos filtros.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border-soft)]">
            {appointments.map((apt) => {
              const client  = apt.clients  as { id: string; name: string; phone: string | null } | null
              const service = apt.services as { name: string; price: number } | null
              return (
                <div key={apt.id} className="px-4 md:px-6 py-3.5 md:py-4 hover:bg-[var(--color-surface-raised)] transition-all">
                  <div className="flex items-start gap-3">
                    {/* Fecha — solo desktop */}
                    <div className="hidden md:block min-w-[120px] shrink-0 pt-0.5">
                      <p className="text-sm font-bold text-[var(--color-navy)]">{formatDate(apt.date)}</p>
                      <p className="text-xs text-[var(--color-ink-secondary)] font-medium mt-0.5">
                        {formatTime(apt.start_time)} – {formatTime(apt.end_time)}
                      </p>
                    </div>

                    {/* Cliente + servicio */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--color-ink)] truncate">
                        {client
                          ? <Link href={`/admin/clientes/${client.id}`} className="hover:text-[var(--color-primary-dark)] transition-colors">{client.name}</Link>
                          : '—'}
                      </p>
                      <p className="text-xs text-[var(--color-ink-secondary)] font-semibold mt-0.5 truncate">
                        {/* Fecha inline en mobile */}
                        <span className="md:hidden text-[var(--color-ink-muted)]">{formatDate(apt.date)} · </span>
                        {service?.name ?? '—'}
                        {service ? ` · ${formatCLP(service.price)}` : ''}
                      </p>
                    </div>

                    {/* Badges + changer */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <AppointmentBadge status={apt.status as AppointmentStatus} />
                      <span className="hidden sm:block">
                        <PaymentBadge status={apt.payment_status} />
                      </span>
                      <StatusChanger appointmentId={apt.id} currentStatus={apt.status as AppointmentStatus} />
                    </div>
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

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
        active
          ? 'bg-[var(--color-navy)] text-white border-[var(--color-navy)] shadow-sm'
          : 'bg-[var(--color-surface)] text-[var(--color-ink-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary-dark)] hover:text-[var(--color-navy)]'
      }`}
    >
      {label}
    </Link>
  )
}
