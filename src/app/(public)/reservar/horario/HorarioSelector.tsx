'use client'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS_ES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function toLocalISO(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function HorarioSelector({
  serviceId,
  serviceDuration,
  selectedFecha,
  slots,
}: {
  serviceId: string
  serviceDuration: number
  selectedFecha?: string
  slots: { slot_start: string; slot_end: string }[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedFecha) {
      const d = new Date(selectedFecha + 'T12:00:00')
      return new Date(d.getFullYear(), d.getMonth(), 1)
    }
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  function prevMonth() {
    setViewMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  }
  function nextMonth() {
    setViewMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))
  }

  function selectDate(date: Date) {
    const iso = toLocalISO(date)
    startTransition(() => {
      router.push(`/reservar/horario?service=${serviceId}&fecha=${iso}`)
    })
  }

  function selectSlot(slot: { slot_start: string; slot_end: string }) {
    router.push(
      `/reservar/datos?service=${serviceId}&fecha=${selectedFecha}&start=${slot.slot_start}&end=${slot.slot_end}`
    )
  }

  // Calendario
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const lastDay  = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0)
  const startOffset = firstDay.getDay() // 0=Dom
  const daysInMonth = lastDay.getDate()

  const isPrevDisabled = viewMonth <= new Date(today.getFullYear(), today.getMonth(), 1)

  return (
    <div className="space-y-6">
      {/* Calendario */}
      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-5">
        {/* Header del mes */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            disabled={isPrevDisabled}
            className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-raised)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} className="text-[var(--color-ink-secondary)]" />
          </button>
          <span className="font-display font-semibold text-[var(--color-navy)]">
            {MONTHS_ES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-raised)] transition-colors">
            <ChevronRight size={18} className="text-[var(--color-ink-secondary)]" />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_ES.map(d => (
            <div key={d} className="text-center text-[11px] font-semibold text-[var(--color-ink-muted)] py-1">{d}</div>
          ))}
        </div>

        {/* Días */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day)
            const iso = toLocalISO(date)
            const isPast     = date < today
            const isSelected = iso === selectedFecha
            const isToday    = iso === toLocalISO(today)
            return (
              <button
                key={day}
                disabled={isPast || isPending}
                onClick={() => selectDate(date)}
                className={[
                  'h-9 w-full rounded-[var(--radius-sm)] text-sm font-medium transition-colors',
                  isPast     ? 'text-[var(--color-ink-muted)] cursor-not-allowed opacity-40' : '',
                  isSelected ? 'bg-[var(--color-navy)] text-white' : '',
                  isToday && !isSelected ? 'border border-[var(--color-dorado)] text-[var(--color-navy)]' : '',
                  !isPast && !isSelected ? 'hover:bg-[var(--color-surface-raised)] text-[var(--color-navy)]' : '',
                ].join(' ')}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Slots de horario */}
      {selectedFecha && (
        <div>
          <p className="text-sm font-semibold text-[var(--color-navy)] mb-3">
            Horarios disponibles
          </p>
          {isPending ? (
            <p className="text-sm text-[var(--color-ink-muted)]">Cargando horarios…</p>
          ) : slots.length === 0 ? (
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 text-center">
              <p className="text-sm text-[var(--color-ink-muted)]">No hay horarios disponibles para este día.</p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">Prueba otro día.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.slot_start}
                  onClick={() => selectSlot(slot)}
                  className="py-2.5 px-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-navy)] hover:border-[var(--color-dorado)] hover:bg-[var(--color-surface-raised)] transition-colors text-center"
                >
                  {slot.slot_start.slice(0, 5)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
