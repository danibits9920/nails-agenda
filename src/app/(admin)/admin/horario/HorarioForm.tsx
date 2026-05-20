'use client'
import { useState, useTransition } from 'react'
import { saveBusinessHours, type DaySchedule } from '@/app/actions/schedule'
import { CheckCircle2, Loader2, Plus, X } from 'lucide-react'

const DAY_NAMES  = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function HorarioForm({ schedules: initial }: { schedules: DaySchedule[] }) {
  const [schedules, setSchedules] = useState<DaySchedule[]>(initial)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(dayOfWeek: number, patch: Partial<DaySchedule>) {
    setSchedules(prev => prev.map(s => s.day_of_week === dayOfWeek ? { ...s, ...patch } : s))
    setSaved(false)
  }

  function addShift2(dayOfWeek: number) {
    update(dayOfWeek, { start_time_2: '14:00', end_time_2: '18:00' })
  }

  function removeShift2(dayOfWeek: number) {
    update(dayOfWeek, { start_time_2: null, end_time_2: null })
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await saveBusinessHours(schedules)
      if (result.error) setError(result.error)
      else setSaved(true)
    })
  }

  const inputCls = 'w-24 px-2.5 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-navy)] font-semibold text-center focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[120px_1fr_1fr_52px] items-center gap-3 px-5 py-3 border-b border-[var(--color-border-soft)]">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">Día</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] text-center">Turno 1 (mañana)</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] text-center">Turno 2 (tarde)</span>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] text-center">On</span>
      </div>

      {/* Rows */}
      {schedules.map((s) => (
        <div
          key={s.day_of_week}
          className={[
            'grid grid-cols-[120px_1fr_1fr_52px] items-center gap-3 px-5 py-4 border-b border-[var(--color-border-soft)] last:border-0 transition-colors',
            s.is_active ? 'bg-white' : 'bg-[var(--color-surface-container-low)] opacity-55',
          ].join(' ')}
        >
          {/* Nombre del día */}
          <p className={['text-sm font-bold', s.is_active ? 'text-[var(--color-navy)]' : 'text-[var(--color-ink-secondary)]'].join(' ')}>
            {DAY_NAMES[s.day_of_week]}
          </p>

          {/* Turno 1 */}
          <div className="flex items-center justify-center gap-1.5">
            <input
              type="time"
              value={s.start_time_1}
              onChange={e => update(s.day_of_week, { start_time_1: e.target.value })}
              disabled={!s.is_active}
              className={inputCls}
            />
            <span className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
            <input
              type="time"
              value={s.end_time_1}
              onChange={e => update(s.day_of_week, { end_time_1: e.target.value })}
              disabled={!s.is_active}
              className={inputCls}
            />
          </div>

          {/* Turno 2 */}
          <div className="flex items-center justify-center gap-1.5">
            {s.start_time_2 != null ? (
              <>
                <input
                  type="time"
                  value={s.start_time_2}
                  onChange={e => update(s.day_of_week, { start_time_2: e.target.value })}
                  disabled={!s.is_active}
                  className={inputCls}
                />
                <span className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
                <input
                  type="time"
                  value={s.end_time_2 ?? ''}
                  onChange={e => update(s.day_of_week, { end_time_2: e.target.value })}
                  disabled={!s.is_active}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => removeShift2(s.day_of_week)}
                  disabled={!s.is_active}
                  className="p-1 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-error)] hover:bg-red-50 transition-colors disabled:opacity-30"
                  title="Quitar turno 2"
                >
                  <X size={13} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => addShift2(s.day_of_week)}
                disabled={!s.is_active}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-ink-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors disabled:opacity-30"
              >
                <Plus size={11} /> Añadir turno
              </button>
            )}
          </div>

          {/* Toggle activo */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => update(s.day_of_week, { is_active: !s.is_active })}
              className={[
                'relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40',
                s.is_active ? 'bg-[var(--color-primary-dark)]' : 'bg-[var(--color-border-strong)]',
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

      {/* Footer */}
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
          className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? 'Guardando…' : 'Guardar horario'}
        </button>
      </div>
    </div>
  )
}
