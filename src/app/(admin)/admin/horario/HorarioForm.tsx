'use client'
import { useState, useTransition } from 'react'
import { saveBusinessHours, type DaySchedule } from '@/app/actions/schedule'
import { CheckCircle2, Loader2 } from 'lucide-react'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function HorarioForm({ schedules: initial }: { schedules: DaySchedule[] }) {
  const [schedules, setSchedules] = useState<DaySchedule[]>(initial)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(dayOfWeek: number, patch: Partial<DaySchedule>) {
    setSchedules(prev =>
      prev.map(s => s.day_of_week === dayOfWeek ? { ...s, ...patch } : s)
    )
    setSaved(false)
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await saveBusinessHours(schedules)
      if (result.error) setError(result.error)
      else setSaved(true)
    })
  }

  const inputClass = 'w-28 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-navy)] font-semibold focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'

  return (
    <div>
      {/* Header de columnas */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-3 border-b border-[var(--color-border-soft)]">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">Día</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] w-28 text-center">Entrada</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] w-28 text-center">Salida</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] w-16 text-center">Activo</span>
      </div>

      {/* Filas */}
      {schedules.map((s) => (
        <div
          key={s.day_of_week}
          className={[
            'grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-4 border-b border-[var(--color-border-soft)] last:border-0 transition-colors',
            s.is_active ? 'bg-white' : 'bg-[var(--color-surface-container-low)] opacity-60',
          ].join(' ')}
        >
          {/* Día */}
          <div>
            <p className={['text-sm font-bold', s.is_active ? 'text-[var(--color-navy)]' : 'text-[var(--color-ink-secondary)]'].join(' ')}>
              {DAY_NAMES[s.day_of_week]}
            </p>
            <p className="text-[11px] text-[var(--color-ink-muted)] font-medium">{DAY_SHORT[s.day_of_week]}</p>
          </div>

          {/* Entrada */}
          <input
            type="time"
            value={s.start_time}
            onChange={e => update(s.day_of_week, { start_time: e.target.value })}
            disabled={!s.is_active}
            className={inputClass}
          />

          {/* Salida */}
          <input
            type="time"
            value={s.end_time}
            onChange={e => update(s.day_of_week, { end_time: e.target.value })}
            disabled={!s.is_active}
            className={inputClass}
          />

          {/* Toggle */}
          <div className="flex justify-center w-16">
            <button
              type="button"
              onClick={() => update(s.day_of_week, { is_active: !s.is_active })}
              className={[
                'relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40',
                s.is_active
                  ? 'bg-[var(--color-primary-dark)]'
                  : 'bg-[var(--color-border-strong)]',
              ].join(' ')}
              aria-label={s.is_active ? 'Desactivar' : 'Activar'}
            >
              <span className={[
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                s.is_active ? 'translate-x-5' : 'translate-x-0',
              ].join(' ')} />
            </button>
          </div>
        </div>
      ))}

      {/* Footer — Guardar */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="h-5">
          {error && <p className="text-xs text-[var(--color-error)] font-semibold">{error}</p>}
          {saved && !isPending && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 size={13} /> Horario guardado correctamente
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? 'Guardando…' : 'Guardar horario'}
        </button>
      </div>
    </div>
  )
}
