import { createClient } from '@/lib/supabase/server'
import { formatCLP, formatDate } from '@/lib/utils'
import { PaymentBadge } from '@/components/ui/Badge'
import PaymentActions from './PaymentActions'

export default async function PagosPage() {
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from('payments')
    .select('id, method, amount, status, proof_url, created_at, appointment_id, appointments(date, clients(name), services(name))')
    .order('created_at', { ascending: false })
    .limit(60)

  const pending = payments?.filter(p => p.status === 'pending') ?? []
  const history = payments?.filter(p => p.status !== 'pending') ?? []

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-display text-4.5xl font-bold text-[var(--color-navy)] tracking-tight">Pagos</h1>
        <p className="text-sm font-semibold text-[var(--color-ink-secondary)] mt-1">
          {pending.length} pago{pending.length !== 1 ? 's' : ''} pendiente{pending.length !== 1 ? 's' : ''} de verificación
        </p>
      </div>

      {/* Pendientes */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 px-1">
            Por verificar
          </h2>
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-amber-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-[var(--color-border-soft)]">
              {pending.map((p) => {
                const apt = p.appointments as any
                return (
                  <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--color-surface-raised)] transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--color-ink)] truncate">
                        {apt?.clients?.name ?? '—'}
                      </p>
                      <p className="text-sm font-semibold text-[var(--color-ink-secondary)] truncate mt-0.5">
                        {apt?.services?.name ?? '—'} · {apt?.date ? formatDate(apt.date) : '—'}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-[var(--color-navy)]">{formatCLP(p.amount)}</p>
                      <p className="text-xs font-bold text-[var(--color-ink-secondary)] capitalize mt-0.5">{p.method}</p>
                    </div>
                    {p.proof_url && (
                      <a
                        href={p.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] transition-colors shrink-0"
                      >
                        Ver comprobante
                      </a>
                    )}
                    <PaymentActions paymentId={p.id} appointmentId={p.appointment_id} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Historial */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-ink-secondary)] px-1">
          Historial
        </h2>
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-sm">
          {!history.length ? (
            <p className="p-8 text-sm font-medium text-center text-[var(--color-ink-muted)]">Sin historial de pagos.</p>
          ) : (
            <div className="divide-y divide-[var(--color-border-soft)]">
              {history.map((p) => {
                const apt = p.appointments as any
                return (
                  <div key={p.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--color-surface-raised)] transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--color-ink)] truncate">{apt?.clients?.name ?? '—'}</p>
                      <p className="text-sm font-semibold text-[var(--color-ink-secondary)] truncate mt-0.5">
                        {apt?.services?.name ?? '—'} · {formatDate(p.created_at)}
                      </p>
                    </div>
                    <p className="font-bold text-[var(--color-navy)] shrink-0">{formatCLP(p.amount)}</p>
                    <PaymentBadge status={p.status} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
