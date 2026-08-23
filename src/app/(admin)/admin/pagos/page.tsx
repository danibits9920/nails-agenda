import { createClient } from '@/lib/supabase/server'
import { formatCLP, formatDate } from '@/lib/utils'
import { PaymentBadge } from '@/components/ui/status-badges'
import PaymentActions from './PaymentActions'

// La forma del join, escrita una vez: `as any` en cada fila apagaba el
// chequeo justo donde los datos pueden venir incompletos.
type PagoJoin = {
 date: string
 clients: { name: string } | null
 services: { name: string } | null
} | null

const METODO: Record<string, string> = {
 cash:     'Efectivo',
 transfer: 'Transferencia',
 online:   'Pago online',
}

export default async function PagosPage() {
  const supabase = await createClient()

  const COLUMNS =
    'id, method, amount, status, proof_url, created_at, appointment_id, appointments(date, clients(name), services(name))'

  // Dos consultas, no una. Antes se traían 60 pagos ordenados por fecha y se
  // separaban en memoria: un pago pendiente más antiguo que esas 60 filas
  // desaparecía de la única pantalla donde se puede verificar. Los pendientes
  // son trabajo por hacer y se traen completos; el historial es consulta y
  // puede paginarse.
  const HISTORY_LIMIT = 60
  const [{ data: pendingRows }, { data: historyRows, count: historyCount }] = await Promise.all([
    supabase
      .from('payments')
      .select(COLUMNS)
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    supabase
      .from('payments')
      .select(COLUMNS, { count: 'exact' })
      .neq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(HISTORY_LIMIT),
  ])

  const pending = pendingRows ?? []
  const history = historyRows ?? []

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="font-display text-page text-[var(--color-navy)]">Pagos</h1>
        <p className="text-sm font-semibold text-[var(--color-ink-secondary)] mt-1">
          {pending.length === 0
            ? 'No hay pagos esperando verificación.'
            : `${pending.length} pago${pending.length !== 1 ? 's' : ''} pendiente${pending.length !== 1 ? 's' : ''} de verificación`}
        </p>
      </div>

      {/* Pendientes */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-eyebrow uppercase text-[var(--color-status-pending-text)] px-1">Por verificar</h2>
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-status-pending-accent)] overflow-hidden shadow-sm">
            <div className="divide-y divide-[var(--color-border-soft)]">
              {pending.map((p) => {
                const apt = p.appointments as PagoJoin
                return (
                  <div key={p.id} className="px-4 md:px-6 py-4 hover:bg-[var(--color-surface-raised)] transition-all">
                    {/* Fila principal */}
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[var(--color-ink)] truncate">{apt?.clients?.name ?? '—'}</p>
                        <p className="text-xs font-semibold text-[var(--color-ink-secondary)] truncate mt-0.5">
                          {apt?.services?.name ?? '—'} · {apt?.date ? formatDate(apt.date) : '—'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-[var(--color-navy)] tabular-nums">{formatCLP(p.amount)}</p>
                        <p className="text-xs font-bold text-[var(--color-ink-secondary)] mt-0.5">{METODO[p.method] ?? p.method}</p>
                      </div>
                    </div>
                    {/* Acciones en línea separada en mobile */}
                    <div className="flex items-center gap-3 mt-2.5">
                      {p.proof_url && (
                        <a href={p.proof_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-bold text-[var(--color-primary-dark)] hover:text-[var(--color-primary)] transition-colors">
                          Ver comprobante →
                        </a>
                      )}
                      <div className="ml-auto">
                        <PaymentActions
                          paymentId={p.id}
                          appointmentId={p.appointment_id}
                          clientName={apt?.clients?.name ?? null}
                          amount={formatCLP(p.amount)}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Historial */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <h2 className="text-eyebrow uppercase text-[var(--color-ink-secondary)]">Historial</h2>
          {(historyCount ?? 0) > HISTORY_LIMIT && (
            <p className="text-xs font-semibold text-[var(--color-ink-muted)]">
              Últimos {HISTORY_LIMIT} de {historyCount}
            </p>
          )}
        </div>
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
          {!history.length ? (
            <p className="p-8 text-sm font-medium text-center text-[var(--color-ink-muted)]">Todavía no has verificado ni rechazado ningún pago.</p>
          ) : (
            <div className="divide-y divide-[var(--color-border-soft)]">
              {history.map((p) => {
                const apt = p.appointments as PagoJoin
                return (
                  <div key={p.id} className="px-4 md:px-6 py-3.5 flex items-center gap-3 hover:bg-[var(--color-surface-raised)] transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[var(--color-ink)] truncate">{apt?.clients?.name ?? '—'}</p>
                      <p className="text-xs font-semibold text-[var(--color-ink-secondary)] truncate mt-0.5">
                        {apt?.services?.name ?? '—'} · {formatDate(p.created_at)}
                      </p>
                    </div>
                    <p className="font-bold text-[var(--color-navy)] shrink-0 text-sm tabular-nums">{formatCLP(p.amount)}</p>
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
