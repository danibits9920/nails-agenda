'use client'
import { useState, useTransition } from 'react'
import { saveBusinessHours, type DaySchedule } from '@/app/actions/schedule'
import { CheckCircle2, Loader2, Plus, X } from 'lucide-react'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function HorarioForm({ schedules: initial }: { schedules: DaySchedule[] }) {
  const [schedules, setSchedules] = useState<DaySchedule[]>(initial)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(dayOfWeek: number, patch: Partial<DaySchedule>) {
    setSchedules(prev => prev.map(s => s.day_of_week === dayOfWeek ? { ...s, ...patch } : s))
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

  const timeCls = 'w-[5.5rem] px-2 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-navy)] font-semibold text-center focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'

  return (
    <div>
      {/* ── DESKTOP: tabla ──────────────────────────────── */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[130px_1fr_1fr_52px] items-center gap-3 px-5 py-3 border-b border-[var(--color-border-soft)]">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)]">Día</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] text-center">Turno 1</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] text-center">Turno 2</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-muted)] text-center">On</span>
        </div>

        {schedules.map(s => (
          <div
            key={s.day_of_week}
            className={[
              'grid grid-cols-[130px_1fr_1fr_52px] items-center gap-3 px-5 py-4 border-b border-[var(--color-border-soft)] last:border-0 transition-colors',
              s.is_active ? 'bg-white' : 'bg-[var(--color-surface-container-low)] opacity-55',
            ].join(' ')}
          >
            <p className={['text-sm font-bold', s.is_active ? 'text-[var(--color-navy)]' : 'text-[var(--color-ink-secondary)]'].join(' ')}>
              {DAY_NAMES[s.day_of_week]}
            </p>

            {/* Turno 1 */}
            <div className="flex items-center justify-center gap-1.5">
              <input type="time" value={s.start_time_1} disabled={!s.is_active} className={timeCls}
                onChange={e => update(s.day_of_week, { start_time_1: e.target.value })} />
              <span className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
              <input type="time" value={s.end_time_1} disabled={!s.is_active} className={timeCls}
                onChange={e => update(s.day_of_week, { end_time_1: e.target.value })} />
            </div>

            {/* Turno 2 */}
            <div className="flex items-center justify-center gap-1.5">
              {s.start_time_2 != null ? (
                <>
                  <input type="time" value={s.start_time_2} disabled={!s.is_active} className={timeCls}
                    onChange={e => update(s.day_of_week, { start_time_2: e.target.value })} />
                  <span className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
                  <input type="time" value={s.end_time_2 ?? ''} disabled={!s.is_active} className={timeCls}
                    onChange={e => update(s.day_of_week, { end_time_2: e.target.value })} />
                  <button type="button" disabled={!s.is_active} onClick={() => update(s.day_of_week, { start_time_2: null, end_time_2: null })}
                    className="p-1 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-error)] hover:bg-red-50 transition-colors disabled:opacity-30">
                    <X size={13} />
                  </button>
                </>
              ) : (
                <button type="button" disabled={!s.is_active}
                  onClick={() => update(s.day_of_week, { start_time_2: '14:00', end_time_2: '18:00' })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-ink-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors disabled:opacity-30">
                  <Plus size={11} /> Turno 2
                </button>
              )}
            </div>

            {/* Toggle */}
            <div className="flex justify-center">
              <Toggle active={s.is_active} onChange={v => update(s.day_of_week, { is_active: v })} />
            </div>
          </div>
        ))}
      </div>

      {/* ── MOBILE: tarjeta por día ──────────────────────── */}
      <div className="md:hidden divide-y divide-[var(--color-border-soft)]">
        {schedules.map(s => (
          <div key={s.day_of_week} className={['px-4 py-4 transition-colors', s.is_active ? 'bg-white' : 'bg-[var(--color-surface-container-low)] opacity-60'].join(' ')}>
            {/* Encabezado del día */}
            <div className="flex items-center justify-between mb-3">
              <p className={['font-bold', s.is_active ? 'text-[var(--color-navy)]' : 'text-[var(--color-ink-secondary)]'].join(' ')}>
                {DAY_NAMES[s.day_of_week]}
              </p>
              <Toggle active={s.is_active} onChange={v => update(s.day_of_week, { is_active: v })} />
            </div>

            {/* Turno 1 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)] w-14 shrink-0">Turno 1</span>
              <input type="time" value={s.start_time_1} disabled={!s.is_active} className={timeCls}
                onChange={e => update(s.day_of_week, { start_time_1: e.target.value })} />
              <span className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
              <input type="time" value={s.end_time_1} disabled={!s.is_active} className={timeCls}
                onChange={e => update(s.day_of_week, { end_time_1: e.target.value })} />
            </div>

            {/* Turno 2 */}
            {s.start_time_2 != null ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)] w-14 shrink-0">Turno 2</span>
                <input type="time" value={s.start_time_2} disabled={!s.is_active} className={timeCls}
                  onChange={e => update(s.day_of_week, { start_time_2: e.target.value })} />
                <span className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
                <input type="time" value={s.end_time_2 ?? ''} disabled={!s.is_active} className={timeCls}
                  onChange={e => update(s.day_of_week, { end_time_2: e.target.value })} />
                <button type="button" disabled={!s.is_active}
                  onClick={() => update(s.day_of_week, { start_time_2: null, end_time_2: null })}
                  className="p-1 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-error)] transition-colors disabled:opacity-30">
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button type="button" disabled={!s.is_active}
                onClick={() => update(s.day_of_week, { start_time_2: '14:00', end_time_2: '18:00' })}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-primary-dark)] transition-colors disabled:opacity-30 mt-1">
                <Plus size={12} /> Añadir segundo turno
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-t border-[var(--color-border-soft)]">
        <div className="h-5">
          {error && <p className="text-xs text-[var(--color-error)] font-semibold">{error}</p>}
          {saved && !isPending && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 size={13} /> Guardado correctamente
            </p>
          )}
        </div>
        <button onClick={handleSave} disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] disabled:opacity-50 transition-all shadow-sm">
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

function Toggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!active)}
      className={['relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40',
        active ? 'bg-[var(--color-primary-dark)]' : 'bg-[var(--color-border-strong)]'].join(' ')}
      aria-label={active ? 'Desactivar' : 'Activar'}>
      <span className={['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
        active ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
    </button>
  )
}
