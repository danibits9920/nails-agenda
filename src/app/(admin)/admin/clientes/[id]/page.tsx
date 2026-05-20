import { createClient } from '@/lib/supabase/server'
import { AppointmentBadge, PaymentBadge } from '@/components/ui/Badge'
import { formatCLP, formatDate, formatTime } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { AppointmentStatus } from '@/types/database'

export default async function ClienteProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: client },
    { data: appointments },
    { data: notes },
  ] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase
      .from('appointments')
      .select('id, date, start_time, end_time, status, payment_status, services(name, price)')
      .eq('client_id', id)
      .order('date', { ascending: false })
      .limit(30),
    supabase
      .from('client_notes')
      .select('id, content, created_at')
      .eq('client_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!client) notFound()

  const totalSpent = appointments
    ?.filter(a => a.payment_status === 'paid')
    .reduce((s, a) => s + Number((a.services as any)?.price ?? 0), 0) ?? 0

  const noShows = appointments?.filter(a => a.status === 'no_show').length ?? 0
  const completed = appointments?.filter(a => a.status === 'completed').length ?? 0

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/clientes" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] mb-6 transition-colors">
        <ArrowLeft size={15} /> Volver a clientes
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-lavanda)] flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-[var(--color-navy)]">{client.name.charAt(0)}</span>
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-navy)]">{client.name}</h1>
          <p className="text-sm text-[var(--color-ink-tertiary)]">
            {[client.phone, client.email].filter(Boolean).join(' · ') || 'Sin contacto'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Visitas totales', value: appointments?.length ?? 0 },
          { label: 'No asistió',     value: noShows },
          { label: 'Total gastado',  value: formatCLP(totalSpent) },
        ].map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 text-center">
            <p className="text-2xl font-semibold text-[var(--color-navy)]">{s.value}</p>
            <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historial de citas */}
        <div className="lg:col-span-2 bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)]">
            <h2 className="font-display text-base font-semibold text-[var(--color-navy)]">Historial de citas</h2>
          </div>
          {!appointments?.length ? (
            <p className="p-8 text-sm text-center text-[var(--color-ink-muted)]">Sin citas registradas.</p>
          ) : (
            <div className="divide-y divide-[var(--color-border-soft)]">
              {appointments.map((apt) => {
                const service = apt.services as { name: string; price: number } | null
                return (
                  <div key={apt.id} className="px-5 py-3 flex items-center gap-3">
                    <div className="min-w-[90px] shrink-0">
                      <p className="text-xs font-medium text-[var(--color-navy)]">{formatDate(apt.date)}</p>
                      <p className="text-xs text-[var(--color-ink-muted)]">{formatTime(apt.start_time)}</p>
                    </div>
                    <p className="flex-1 text-sm text-[var(--color-ink)] truncate">{service?.name ?? '—'}</p>
                    <AppointmentBadge status={apt.status as AppointmentStatus} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Notas y preferencias */}
        <div className="space-y-4">
          {client.preferences && Object.keys(client.preferences).length > 0 && (
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-5">
              <h2 className="font-display text-base font-semibold text-[var(--color-navy)] mb-3">Preferencias</h2>
              <pre className="text-xs text-[var(--color-ink-secondary)] whitespace-pre-wrap">{JSON.stringify(client.preferences, null, 2)}</pre>
            </div>
          )}
          {client.allergies && (
            <div className="bg-[var(--color-error-bg)] rounded-[var(--radius-lg)] border border-[var(--color-error)]/20 p-4">
              <p className="text-xs font-semibold text-[var(--color-error)] uppercase tracking-wider mb-1">Alergias</p>
              <p className="text-sm text-[var(--color-ink)]">{client.allergies}</p>
            </div>
          )}
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="font-display text-base font-semibold text-[var(--color-navy)]">Notas</h2>
            </div>
            {!notes?.length ? (
              <p className="p-5 text-sm text-[var(--color-ink-muted)]">Sin notas.</p>
            ) : (
              <div className="divide-y divide-[var(--color-border-soft)]">
                {notes.map(note => (
                  <div key={note.id} className="px-5 py-3">
                    <p className="text-sm text-[var(--color-ink)]">{note.content}</p>
                    <p className="text-xs text-[var(--color-ink-muted)] mt-1">{formatDate(note.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
