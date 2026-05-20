import { createClient } from '@/lib/supabase/server'
import HorarioForm from './HorarioForm'
import { Clock } from 'lucide-react'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const DEFAULT_HOURS = DAY_NAMES.map((_, i) => ({
  day_of_week: i,
  start_time: '09:00',
  end_time: '19:00',
  is_active: i !== 0, // Domingo libre por defecto
}))

export default async function HorarioAdminPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows } = await (supabase as any)
    .from('business_hours')
    .select('day_of_week, start_time, end_time, is_active')
    .order('day_of_week')

  // Merge con defaults para garantizar los 7 días
  const schedules = DEFAULT_HOURS.map((def) => {
    const saved = rows?.find((r: any) => r.day_of_week === def.day_of_week)
    if (!saved) return def
    return {
      day_of_week: saved.day_of_week,
      start_time:  String(saved.start_time).slice(0, 5),
      end_time:    String(saved.end_time).slice(0, 5),
      is_active:   saved.is_active,
    }
  })

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Clock size={22} className="text-[var(--color-primary-dark)]" />
          <h1 className="font-display text-3xl font-bold text-[var(--color-navy)] tracking-tight">
            Horario de atención
          </h1>
        </div>
        <p className="text-sm font-medium text-[var(--color-ink-secondary)] ml-9">
          Define los días y horas en que Yurany está disponible para recibir citas.
        </p>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-1 shadow-[var(--shadow-card)]">
        <HorarioForm schedules={schedules} />
      </div>

      <div className="bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-border-soft)] p-4 text-xs text-[var(--color-ink-secondary)] leading-relaxed">
        <p className="font-semibold text-[var(--color-ink)] mb-1">ℹ️ Información</p>
        <p>Los slots de horario se generan cada 30 minutos dentro del rango configurado.
        Si un día está desactivado, los clientes no podrán reservar ese día y verán "Sin horarios disponibles".</p>
      </div>
    </div>
  )
}
