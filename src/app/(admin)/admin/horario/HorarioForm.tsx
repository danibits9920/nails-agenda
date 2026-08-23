'use client'
import { useState, useTransition } from 'react'
import { saveBusinessHours, type DaySchedule } from '@/app/actions/schedule'
import { CheckCircle2, Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const TIME_CLS =
  'w-[5.5rem] min-h-11 px-2 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-base md:text-sm text-[var(--color-navy)] font-semibold text-center focus-visible:border-[var(--color-primary-dark)] transition-all disabled:bg-[var(--color-surface-container)] disabled:text-[var(--color-ink-tertiary)] disabled:cursor-not-allowed shadow-sm'

/**
 * Campo de hora que se nombra a sí mismo.
 *
 * La etiqueta visible ("Turno 1") no puede asociarse a estos inputs sin romper
 * la retícula, así que el nombre accesible se compone del día, el turno y el
 * extremo: "Lunes, turno 1, hora de inicio". Antes eran 28 campos que un lector
 * de pantalla anunciaba como "hora" a secas, uno tras otro.
 */
function TimeField({
  day, shift, edge, value, disabled, onChange,
}: {
 day: number
 shift: 1 | 2
 edge: 'inicio' | 'término'
 value: string
 disabled: boolean
  onChange: (v: string) => void
}) {
  return (
    <input
      type="time"
      value={value}
      disabled={disabled}
      aria-label={`${DAY_NAMES[day]}, turno ${shift}, hora de ${edge}`}
      className={TIME_CLS}
      onChange={e => onChange(e.target.value)}
    />
  )
}

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
      if (result.error) { setError(result.error); toast.error(result.error) }
      else { setSaved(true); toast.success('Horario guardado') }
    })
  }

  return (
    <div>
      {/* ── DESKTOP: tabla ──────────────────────────────── */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[130px_1fr_1fr_52px] items-center gap-3 px-5 py-3 border-b border-[var(--color-border-soft)]">
          <span className="text-eyebrow uppercase text-[var(--color-ink-muted)]">Día</span>
          <span className="text-eyebrow uppercase text-[var(--color-ink-muted)] text-center">Turno 1</span>
          <span className="text-eyebrow uppercase text-[var(--color-ink-muted)] text-center">Turno 2</span>
          <span className="text-eyebrow uppercase text-[var(--color-ink-muted)] text-center">Abierto</span>
        </div>

        {schedules.map(s => (
          <div
            key={s.day_of_week}
            className={[
              'grid grid-cols-[130px_1fr_1fr_52px] items-center gap-3 px-5 py-4 border-b border-[var(--color-border-soft)] last:border-0 transition-colors',
              s.is_active ? 'bg-white' : 'bg-[var(--color-surface-container-low)]',
            ].join(' ')}
          >
            <p className={['text-sm font-bold', s.is_active ? 'text-[var(--color-navy)]' : 'text-[var(--color-ink-secondary)]'].join(' ')}>
              {DAY_NAMES[s.day_of_week]}
            </p>

            {/* Turno 1 */}
            <div className="flex items-center justify-center gap-1.5">
              <TimeField day={s.day_of_week} shift={1} edge="inicio" value={s.start_time_1} disabled={!s.is_active}
                onChange={v => update(s.day_of_week, { start_time_1: v })} />
              <span aria-hidden className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
              <TimeField day={s.day_of_week} shift={1} edge="término" value={s.end_time_1} disabled={!s.is_active}
                onChange={v => update(s.day_of_week, { end_time_1: v })} />
            </div>

            {/* Turno 2 */}
            <div className="flex items-center justify-center gap-1.5">
              {s.start_time_2 != null ? (
                <>
                  <TimeField day={s.day_of_week} shift={2} edge="inicio" value={s.start_time_2} disabled={!s.is_active}
                onChange={v => update(s.day_of_week, { start_time_2: v })} />
                  <span aria-hidden className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
                  <TimeField day={s.day_of_week} shift={2} edge="término" value={s.end_time_2 ?? ''} disabled={!s.is_active}
                onChange={v => update(s.day_of_week, { end_time_2: v })} />
                  <button type="button" disabled={!s.is_active} onClick={() => update(s.day_of_week, { start_time_2: null, end_time_2: null })}
                    aria-label="Quitar turno 2"
                    className="tap-target p-2 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-error-text)] hover:bg-[var(--color-error-bg)] transition-colors disabled:opacity-30">
                    <X size={13} />
                  </button>
                </>
              ) : (
                <button type="button" disabled={!s.is_active}
                  onClick={() => update(s.day_of_week, { start_time_2: '14:00', end_time_2: '18:00' })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-[var(--color-border)] text-xs font-semibold text-[var(--color-ink-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors disabled:opacity-30">
                  <Plus size={11} aria-hidden /> Añadir turno 2
                </button>
              )}
            </div>

            <div className="flex justify-center">
              <Switch checked={s.is_active} onCheckedChange={(checked) => update(s.day_of_week, { is_active: checked })} />
            </div>
          </div>
        ))}
      </div>

      {/* ── MOBILE: tarjeta por día ──────────────────────── */}
      <div className="md:hidden divide-y divide-[var(--color-border-soft)]">
        {schedules.map(s => (
          <div key={s.day_of_week} className={['px-4 py-4 transition-colors', s.is_active ? 'bg-white' : 'bg-[var(--color-surface-container-low)]'].join(' ')}>
            {/* Encabezado del día */}
            <div className="flex items-center justify-between mb-3">
              <p className={['font-bold', s.is_active ? 'text-[var(--color-navy)]' : 'text-[var(--color-ink-secondary)]'].join(' ')}>
                {DAY_NAMES[s.day_of_week]}
              </p>
              <Switch checked={s.is_active} onCheckedChange={(checked) => update(s.day_of_week, { is_active: checked })} />
            </div>

            {/* Turno 1 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-micro uppercase text-[var(--color-ink-muted)] w-14 shrink-0">Turno 1</span>
              <TimeField day={s.day_of_week} shift={1} edge="inicio" value={s.start_time_1} disabled={!s.is_active}
                onChange={v => update(s.day_of_week, { start_time_1: v })} />
              <span aria-hidden className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
              <TimeField day={s.day_of_week} shift={1} edge="término" value={s.end_time_1} disabled={!s.is_active}
                onChange={v => update(s.day_of_week, { end_time_1: v })} />
            </div>

            {/* Turno 2 */}
            {s.start_time_2 != null ? (
              <div className="flex items-center gap-2">
                <span className="text-micro uppercase text-[var(--color-ink-muted)] w-14 shrink-0">Turno 2</span>
                <TimeField day={s.day_of_week} shift={2} edge="inicio" value={s.start_time_2} disabled={!s.is_active}
                onChange={v => update(s.day_of_week, { start_time_2: v })} />
                <span aria-hidden className="text-[var(--color-ink-muted)] text-xs font-bold">–</span>
                <TimeField day={s.day_of_week} shift={2} edge="término" value={s.end_time_2 ?? ''} disabled={!s.is_active}
                onChange={v => update(s.day_of_week, { end_time_2: v })} />
                <button type="button" disabled={!s.is_active}
                  onClick={() => update(s.day_of_week, { start_time_2: null, end_time_2: null })}
                  aria-label="Quitar turno 2"
                  className="tap-target p-2 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-error)] transition-colors disabled:opacity-30">
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button type="button" disabled={!s.is_active}
                onClick={() => update(s.day_of_week, { start_time_2: '14:00', end_time_2: '18:00' })}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-primary-dark)] transition-colors disabled:opacity-30 mt-1">
                <Plus size={12} aria-hidden /> Añadir turno 2
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-t border-[var(--color-border-soft)]">
        <div className="h-5" role="status" aria-live="polite">
          {error && <p className="text-xs text-[var(--color-error-text)] font-semibold">{error}</p>}
          {saved && !isPending && (
            <p className="flex items-center gap-1.5 text-xs text-[var(--color-status-completed-text)] font-semibold">
              <CheckCircle2 size={13} /> Guardado correctamente
            </p>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-full px-5 py-2.5 min-h-11 h-auto bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-light)]"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </div>
  )
}

