import { createClient } from '@/lib/supabase/server'
import HorarioForm from './HorarioForm'
import { Clock, Info } from 'lucide-react'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const DEFAULT_HOURS = DAY_NAMES.map((_, i) => ({
  day_of_week:  i,
  start_time_1: '08:00',
  end_time_1:   '17:00',
  start_time_2: null,
  end_time_2:   null,
  is_active:    i !== 0,
}))

export default async function HorarioAdminPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('business_hours')
    .select('day_of_week, start_time_1, end_time_1, start_time_2, end_time_2, is_active')
    .order('day_of_week')

  const schedules = DEFAULT_HOURS.map((def) => {
    const saved = rows?.find(r => r.day_of_week === def.day_of_week)
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
          <h1 className="font-display text-page text-[var(--color-navy)]">
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

      <div className="flex gap-3 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-border-soft)] p-4 text-xs text-[var(--color-ink-secondary)] leading-relaxed">
        <Info size={15} aria-hidden className="shrink-0 mt-0.5 text-[var(--color-primary-dark)]" />
        <div>
          <p className="font-semibold text-[var(--color-ink)] mb-1">Cómo funciona</p>
          <p>
            Dentro de cada turno abierto, las clientas pueden reservar cada media hora.
            El turno 2 es opcional: úsalo para los días en que cierras al mediodía y
            vuelves a abrir por la tarde.
          </p>
        </div>
      </div>
    </div>
  )
}
