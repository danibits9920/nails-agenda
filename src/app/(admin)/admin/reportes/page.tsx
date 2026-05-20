import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'

export default async function ReportesPage() {
  const supabase = await createClient()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfYear  = new Date(now.getFullYear(), 0, 1).toISOString()

  const [
    { data: monthPayments },
    { data: yearPayments },
    { data: aptsByStatus },
    { data: topServices },
    { count: noShowCount },
    { count: totalApts },
  ] = await Promise.all([
    supabase.from('payments').select('amount').eq('status', 'verified').gte('created_at', startOfMonth),
    supabase.from('payments').select('amount').eq('status', 'verified').gte('created_at', startOfYear),
    supabase.from('appointments').select('status'),
    supabase.from('appointments')
      .select('service_id, services(name)')
      .not('status', 'in', '("cancelled","no_show")')
      .limit(300),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'no_show'),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
  ])

  const monthRevenue = monthPayments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const yearRevenue  = yearPayments?.reduce((s, p)  => s + Number(p.amount), 0) ?? 0

  const statusCount = (aptsByStatus ?? []).reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  const serviceCount = (topServices ?? []).reduce<Record<string, { name: string; count: number }>>((acc, a) => {
    const svc = a.services as { name: string } | null
    if (!svc || !a.service_id) return acc
    if (!acc[a.service_id]) acc[a.service_id] = { name: svc.name, count: 0 }
    acc[a.service_id]!.count++
    return acc
  }, {})

  const topServicesList = Object.values(serviceCount).sort((a, b) => b.count - a.count).slice(0, 6)
  const maxCount = topServicesList[0]?.count ?? 1
  const noShowRate = totalApts ? ((noShowCount ?? 0) / totalApts * 100).toFixed(1) : '0'

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente', confirmed: 'Confirmada', in_progress: 'En curso',
    completed: 'Completada', cancelled: 'Cancelada', no_show: 'No asistió',
  }
  const statusColors: Record<string, string> = {
    pending: '#FFB74D', confirmed: '#64B5F6', in_progress: '#D4BCEC',
    completed: '#81C784', cancelled: '#BDBDBD', no_show: '#E57373',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--color-navy)]">Reportes</h1>
        <p className="text-sm text-[var(--color-ink-tertiary)] mt-0.5">{now.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Ingresos */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <RevenueCard label="Ingresos del mes" value={formatCLP(monthRevenue)} />
        <RevenueCard label={`Ingresos ${now.getFullYear()}`} value={formatCLP(yearRevenue)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citas por estado */}
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
          <h2 className="font-display text-base font-semibold text-[var(--color-navy)] mb-4">Citas por estado</h2>
          <div className="space-y-2.5">
            {Object.entries(statusCount).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="text-xs font-medium text-[var(--color-ink-secondary)] w-24 shrink-0">
                  {statusLabels[status] ?? status}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-surface-overlay)]">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(count / (totalApts ?? 1)) * 100}%`,
                      background: statusColors[status] ?? '#ccc',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--color-navy)] w-6 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-ink-muted)] mt-4">
            Tasa de no-shows: <strong>{noShowRate}%</strong>
          </p>
        </div>

        {/* Servicios más solicitados */}
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
          <h2 className="font-display text-base font-semibold text-[var(--color-navy)] mb-4">Servicios más solicitados</h2>
          {!topServicesList.length ? (
            <p className="text-sm text-[var(--color-ink-muted)]">Sin datos suficientes.</p>
          ) : (
            <div className="space-y-2.5">
              {topServicesList.map((svc, i) => (
                <div key={svc.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--color-ink-muted)] w-4 shrink-0">{i + 1}</span>
                  <span className="text-xs text-[var(--color-ink-secondary)] flex-1 truncate">{svc.name}</span>
                  <div className="w-24 h-2 rounded-full bg-[var(--color-surface-overlay)]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-lavanda)]"
                      style={{ width: `${(svc.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-navy)] w-5 text-right shrink-0">{svc.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RevenueCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)] mb-2">{label}</p>
      <p className="font-display text-3xl font-semibold text-[var(--color-navy)]">{value}</p>
    </div>
  )
}
