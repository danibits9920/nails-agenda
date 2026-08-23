import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import { APPOINTMENT_STATUS } from '@/components/ui/status-badges'
import type { AppointmentStatus } from '@/types/database'
import { BarChart3 } from 'lucide-react'
import { BUSINESS_TZ, yearInBusinessTz } from '@/lib/tz'

type ReportStats = {
  month_revenue: number
  year_revenue: number
  status_counts: Record<string, number>
  total_appointments: number
  no_show_count: number
  top_services: { name: string; count: number }[]
}

export default async function ReportesPage() {
  const supabase = await createClient()
  const now = new Date()

  // Una llamada en vez de seis. Antes esta página traía todas las citas que
  // existen para contarlas por estado en JavaScript, y calculaba el ranking
  // de servicios sobre 300 filas sin orden explícito — un resultado que ni
  // siquiera era determinista. Ahora Postgres agrega y devuelve once números.
  const { data, error } = await supabase.rpc('get_report_stats')
  const stats = data as ReportStats | null

  if (error || !stats) {
    // Sin implementación duplicada de respaldo: si la función no está, se
    // dice qué falta en vez de dejar la página en blanco o mantener viva la
    // ruta lenta para siempre.
    // PostgREST responde PGRST202 cuando la función no está en su caché de
    // esquema, y Postgres 42883 (undefined_function) si llega hasta la base.
    // Se cubren los dos para que el aviso nombre la causa correcta.
    const faltaMigracion =
      error?.code === 'PGRST202' ||
      error?.code === '42883' ||
      /could not find the function|does not exist/i.test(error?.message ?? '')
    return (
      <div className="p-8">
        <h1 className="font-display text-page text-[var(--color-navy)] mb-6">Reportes</h1>
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[var(--color-status-pending-bg)] flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={24} className="text-[var(--color-status-pending-text)]" aria-hidden />
          </div>
          <p className="text-sm font-bold text-[var(--color-navy)]">No se pudieron calcular los reportes.</p>
          <p className="text-sm text-[var(--color-ink-secondary)] mt-1 max-w-sm mx-auto leading-relaxed">
            {faltaMigracion
              ? 'Falta aplicar la migración 012_report_stats.sql en la base de datos. El resto del panel funciona con normalidad.'
              : 'Vuelve a cargar la página. Si el problema sigue, revisa la conexión con la base de datos.'}
          </p>
        </div>
      </div>
    )
  }

  const { month_revenue: monthRevenue, year_revenue: yearRevenue } = stats
  const statusCount  = stats.status_counts
  const totalApts    = stats.total_appointments
  const topServicesList = stats.top_services
  const maxCount     = topServicesList[0]?.count ?? 1
  const noShowRate   = totalApts ? ((stats.no_show_count / totalApts) * 100).toFixed(1) : '0'

  const statusAccent = (s: string) =>
    APPOINTMENT_STATUS[s as AppointmentStatus]?.accent
    ?? 'var(--color-status-noshow-accent)'

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-display text-page text-[var(--color-navy)]">Reportes</h1>
        <p className="text-sm font-semibold text-[var(--color-ink-secondary)] mt-1 capitalize">{now.toLocaleDateString('es-CL', { timeZone: BUSINESS_TZ, month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Ingresos */}
      <div className="grid grid-cols-2 gap-6">
        <RevenueCard label="Ingresos del mes" value={formatCLP(monthRevenue)} />
        <RevenueCard label={`Ingresos ${yearInBusinessTz()}`} value={formatCLP(yearRevenue)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citas por estado */}
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 shadow-sm">
          <h2 className="font-display text-section text-[var(--color-navy)] mb-5">Citas por estado</h2>
          <div className="space-y-4">
            {Object.entries(statusCount).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="text-xs font-bold text-[var(--color-ink-secondary)] w-28 shrink-0">
                  {APPOINTMENT_STATUS[status as AppointmentStatus]?.label ?? status}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-surface-overlay)]">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
 width: `${(count / (totalApts ?? 1)) * 100}%`,
 background: statusAccent(status),
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-[var(--color-navy)] w-6 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-[var(--color-ink-secondary)] mt-5 pt-4 border-t border-[var(--color-border-soft)]">
            Citas a las que la clienta no llegó: <span className="text-[var(--color-error)] text-sm font-bold ml-1">{noShowRate}%</span>
          </p>
        </div>

        {/* Servicios más solicitados */}
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 shadow-sm">
          <h2 className="font-display text-section text-[var(--color-navy)] mb-5">Servicios más solicitados</h2>
          {!topServicesList.length ? (
            <p className="text-sm font-medium text-center text-[var(--color-ink-muted)] py-12">Todavía no hay citas completadas para calcular el ranking.</p>
          ) : (
            <div className="space-y-4">
              {topServicesList.map((svc, i) => (
                <div key={svc.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--color-ink-secondary)] w-4 shrink-0">{i + 1}</span>
                  <span className="text-xs font-bold text-[var(--color-ink-secondary)] flex-1 truncate">{svc.name}</span>
                  <div className="w-24 h-2 rounded-full bg-[var(--color-surface-overlay)]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-lavanda)]"
                      style={{ width: `${(svc.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[var(--color-navy)] w-5 text-right shrink-0">{svc.count}</span>
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
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
      <p className="text-eyebrow uppercase text-[var(--color-ink-secondary)] mb-3">{label}</p>
      <p className="font-display text-metric tabular-nums text-[var(--color-navy)]">{value}</p>
    </div>
  )
}
