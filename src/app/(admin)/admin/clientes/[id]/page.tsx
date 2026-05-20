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
    <div className="p-8 max-w-4xl space-y-8">
      <Link href="/admin/clientes" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-ink-secondary)] hover:text-[var(--color-primary-dark)] transition-colors">
        <ArrowLeft size={16} /> Volver a clientes
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-2xl font-bold text-[var(--color-navy)]">{client.name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h1 className="font-display text-4xl font-bold text-[var(--color-navy)] tracking-tight">{client.name}</h1>
          <p className="text-sm font-semibold text-[var(--color-ink-secondary)] mt-1">
            {[client.phone, client.email].filter(Boolean).join(' · ') || 'Sin información de contacto'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Visitas totales', value: appointments?.length ?? 0 },
          { label: 'No asistió',     value: noShows },
          { label: 'Total gastado',  value: formatCLP(totalSpent) },
        ].map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 text-center shadow-sm">
            <p className="text-2.5xl font-bold text-[var(--color-navy)] tracking-tight">{s.value}</p>
            <p className="text-[10px] font-bold text-[var(--color-ink-secondary)] mt-1.5 uppercase tracking-[0.12em]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historial de citas */}
        <div className="lg:col-span-2 bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[var(--color-border)]">
            <h2 className="font-display text-lg font-bold text-[var(--color-navy)] tracking-tight">Historial de citas</h2>
          </div>
          {!appointments?.length ? (
            <p className="p-8 text-sm font-medium text-center text-[var(--color-ink-muted)]">Sin citas registradas.</p>
          ) : (
            <div className="divide-y divide-[var(--color-border-soft)]">
              {appointments.map((apt) => {
                const service = apt.services as { name: string; price: number } | null
                return (
                  <div key={apt.id} className="px-6 py-4 flex items-center gap-3 hover:bg-[var(--color-surface-raised)] transition-all">
                    <div className="min-w-[100px] shrink-0">
                      <p className="text-xs font-bold text-[var(--color-navy)]">{formatDate(apt.date)}</p>
                      <p className="text-xs font-semibold text-[var(--color-ink-secondary)] mt-0.5">{formatTime(apt.start_time)}</p>
                    </div>
                    <p className="flex-1 text-sm font-bold text-[var(--color-ink)] truncate">{service?.name ?? '—'}</p>
                    <AppointmentBadge status={apt.status as AppointmentStatus} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Notas y preferencias */}
        <div className="space-y-6">
          {client.preferences && Object.keys(client.preferences).length > 0 && (
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 shadow-sm">
              <h2 className="font-display text-base font-bold text-[var(--color-navy)] mb-4 tracking-tight">Preferencias</h2>
              <pre className="text-xs text-[var(--color-ink-secondary)] font-semibold bg-[var(--color-cream)] p-3 rounded-[var(--radius-md)] border border-[var(--color-border-soft)] overflow-x-auto whitespace-pre-wrap">{JSON.stringify(client.preferences, null, 2)}</pre>
            </div>
          )}
          {client.allergies && (
            <div className="bg-[var(--color-error-bg)] rounded-[var(--radius-xl)] border border-[var(--color-error)]/20 p-5 shadow-sm">
              <p className="text-xs font-bold text-[var(--color-error)] uppercase tracking-[0.15em] mb-2">Alergias</p>
              <p className="text-sm font-semibold text-[var(--color-ink)]">{client.allergies}</p>
            </div>
          )}
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-[var(--color-border)]">
              <h2 className="font-display text-base font-bold text-[var(--color-navy)] tracking-tight">Notas</h2>
            </div>
            {!notes?.length ? (
              <p className="p-6 text-sm font-medium text-[var(--color-ink-muted)]">Sin notas registradas.</p>
            ) : (
              <div className="divide-y divide-[var(--color-border-soft)]">
                {notes.map(note => (
                  <div key={note.id} className="px-6 py-4">
                    <p className="text-sm font-semibold text-[var(--color-ink)] leading-relaxed">{note.content}</p>
                    <p className="text-[10px] font-bold text-[var(--color-ink-secondary)] mt-2 uppercase tracking-wider">{formatDate(note.created_at)}</p>
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
