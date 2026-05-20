import { createClient } from '@/lib/supabase/server'
import HorarioForm from './HorarioForm'
import { Clock } from 'lucide-react'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const DEFAULT_HOURS = DAY_NAMES.map((_, i) => ({
  day_of_week:  i,
  start_time_1: '08:00',
  end_time_1:   '12:00',
  start_time_2: i === 0 ? null : '14:00',
  end_time_2:   i === 0 ? null : '18:00',
  is_active:    i !== 0,
}))

export default async function HorarioAdminPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows } = await (supabase as any)
    .from('business_hours')
    .select('day_of_week, start_time_1, end_time_1, start_time_2, end_time_2, is_active')
    .order('day_of_week')

  const schedules = DEFAULT_HOURS.map((def) => {
    const saved = rows?.find((r: any) => r.day_of_week === def.day_of_week)
    if (!saved) return def
    return {
      day_of_week:  saved.day_of_week,
      start_time_1: String(saved.start_time_1).slice(0, 5),
      end_time_1:   String(saved.end_time_1).slice(0, 5),
      start_time_2: saved.start_time_2 ? String(saved.start_time_2).slice(0, 5) : null,
      end_time_2:   saved.end_time_2   ? String(saved.end_time_2).slice(0, 5)   : null,
      is_active:    saved.is_active,
    }
  })

  return (
    <div className="p-4 md:p-8 max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Clock size={22} className="text-[var(--color-primary-dark)]" />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">
            Horario de atención
          </h1>
        </div>
        <p className="text-sm font-medium text-[var(--color-ink-secondary)] ml-9">
          Define los días y turnos de disponibilidad para reservas.
        </p>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-x-auto shadow-[var(--shadow-card)]">
        <HorarioForm schedules={schedules} />
      </div>

      <div className="bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-border-soft)] p-4 text-xs text-[var(--color-ink-secondary)] leading-relaxed">
        <p className="font-semibold text-[var(--color-ink)] mb-1">ℹ️ Cómo funciona</p>
        <p>Los slots se generan cada 30 minutos dentro de cada turno activo. El Turno 2 es opcional — si no lo necesitas, haz clic en "Añadir turno" solo para los días que lo requieran.</p>
      </div>
    </div>
  )
}
