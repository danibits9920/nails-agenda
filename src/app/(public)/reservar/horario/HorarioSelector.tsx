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

  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const lastDay  = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0)
  const startOffset = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const isPrevDisabled = viewMonth <= new Date(today.getFullYear(), today.getMonth(), 1)

  return (
    <div className="space-y-5">
      {/* Calendario */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)]">
        {/* Header mes */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            disabled={isPrevDisabled}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container-low)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} strokeWidth={2} className="text-[var(--color-ink-secondary)]" />
          </button>
          <span className="font-display font-semibold text-[var(--color-navy)] text-sm">
            {MONTHS_ES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors"
          >
            <ChevronRight size={16} strokeWidth={2} className="text-[var(--color-ink-secondary)]" />
          </button>
        </div>

        {/* Días semana */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS_ES.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-[var(--color-ink-muted)] py-1 tracking-wide">{d}</div>
          ))}
        </div>

        {/* Grid días */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
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
                  'h-9 w-9 mx-auto rounded-full text-xs font-semibold transition-all duration-150 flex items-center justify-center',
                  isPast
                    ? 'text-[var(--color-ink-muted)] cursor-not-allowed opacity-35'
                    : '',
                  isSelected
                    ? 'bg-[var(--color-navy)] text-white shadow-sm scale-110 ring-4 ring-[var(--color-navy)]/10'
                    : '',
                  isToday && !isSelected
                    ? 'border-2 border-[var(--color-primary-dark)] text-[var(--color-navy)] font-bold'
                    : '',
                  !isPast && !isSelected
                    ? 'hover:bg-[var(--color-surface-container-low)] text-[var(--color-navy)] hover:border hover:border-[var(--color-border)]'
                    : '',
                ].filter(Boolean).join(' ')}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Slots */}
      {selectedFecha && (
        <div className="animate-in fade-in duration-300">
          <p className="text-sm font-semibold text-[var(--color-navy)] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            Horarios disponibles
          </p>
          {isPending ? (
            <p className="text-sm text-[var(--color-ink-muted)] animate-pulse py-4 text-center">Cargando horarios…</p>
          ) : slots.length === 0 ? (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-[var(--shadow-card)]">
              <p className="text-sm font-semibold text-[var(--color-navy)]">No hay horarios disponibles para este día.</p>
              <p className="text-xs text-[var(--color-ink-secondary)] mt-1">Prueba seleccionando otra fecha.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {slots.map((slot) => (
                <button
                  key={slot.slot_start}
                  onClick={() => selectSlot(slot)}
                  className="py-3 px-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm font-bold text-[var(--color-navy)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/15 hover:scale-105 active:scale-95 transition-all duration-150 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-raised)]"
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
