'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import type { AppointmentStatus } from '@/types/database'

// Colores según design system Stitch — Nails Art Yurany
const STATUS_CARD: Record<AppointmentStatus, string> = {
  pending:     'bg-amber-50     border-l-4 border-amber-400  text-amber-900',
  confirmed:   'bg-[#D4BCEC]/20 border-l-4 border-[#D4BCEC] text-[var(--color-navy)]',
  in_progress: 'bg-[#EDAAB5]/20 border-l-4 border-[#EDAAB5] text-[var(--color-navy)]',
  completed:   'bg-emerald-50   border-l-4 border-emerald-400 text-emerald-900',
  cancelled:   'bg-gray-100     border-l-4 border-gray-300   text-gray-500',
  no_show:     'bg-red-50       border-l-4 border-red-300    text-red-800',
}

const STATUS_DOT: Record<AppointmentStatus, string> = {
  pending:     'bg-amber-400',
  confirmed:   'bg-[#D4BCEC]',
  in_progress: 'bg-[#EDAAB5]',
  completed:   'bg-emerald-400',
  cancelled:   'bg-gray-400',
  no_show:     'bg-red-400',
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending:     'Pendiente',
  confirmed:   'Confirmada',
  in_progress: 'En curso',
  completed:   'Completada',
  cancelled:   'Cancelada',
  no_show:     'No asistió',
}

// Colores compactos para el grid semanal (sin border-l-4)
const STATUS_GRID: Record<AppointmentStatus, string> = {
  pending:     'bg-amber-50   border-amber-300  text-amber-900',
  confirmed:   'bg-[#D4BCEC]/30 border-[#D4BCEC] text-[var(--color-navy)]',
  in_progress: 'bg-[#EDAAB5]/30 border-[#EDAAB5] text-[var(--color-navy)]',
  completed:   'bg-emerald-50 border-emerald-300 text-emerald-900',
  cancelled:   'bg-gray-100   border-gray-300   text-gray-500',
  no_show:     'bg-red-50     border-red-300    text-red-800',
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 08:00–20:00
const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const DAYS_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

type Apt = {
  id: string
  date: string
  start_time: string
  end_time: string
  status: string
  clients: { name: string } | null
  services: { name: string; description: string | null } | null
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return (h! - 8) * 60 + m!
}

const CELL_H = 56

export default function CalendarWeek({
  weekDates,
  appointments,
  anchorDate,
}: {
  weekDates: string[]
  appointments: Apt[]
  anchorDate: string
}) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  function navigateWeek(delta: number) {
    const d = new Date(anchorDate + 'T12:00:00')
    d.setDate(d.getDate() + delta * 7)
    router.push(`/admin/calendario?fecha=${d.toISOString().split('T')[0]}`)
  }

  function navigateDay(delta: number) {
    const d = new Date(anchorDate + 'T12:00:00')
    d.setDate(d.getDate() + delta)
    router.push(`/admin/calendario?fecha=${d.toISOString().split('T')[0]}`)
  }

  // El día seleccionado en mobile es el anchorDate
  const selectedDate = anchorDate
  const selectedDayIndex = weekDates.findIndex(d => d === selectedDate)
  const dayAptsMobile = appointments.filter(a => a.date === selectedDate)

  return (
    <div className="flex flex-col flex-1 bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-sm">

      {/* ═══════════════════════════════════════════════════
          MOBILE — Vista de día único
      ═══════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col flex-1 min-h-0">

        {/* Navegación de día */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-white">
          <button
            onClick={() => navigateDay(-1)}
            className="p-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] transition-all"
          >
            <ChevronLeft size={18} className="text-[var(--color-navy)]" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-widest">
              {DAYS_FULL[selectedDayIndex >= 0 ? selectedDayIndex : 0]}
            </p>
            <p className="text-lg font-bold text-[var(--color-navy)] leading-tight">
              {new Date(selectedDate + 'T12:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
            </p>
          </div>
          <button
            onClick={() => navigateDay(1)}
            className="p-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] transition-all"
          >
            <ChevronRight size={18} className="text-[var(--color-navy)]" />
          </button>
        </div>

        {/* Lista de citas del día */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {dayAptsMobile.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mb-3 text-2xl">
                📅
              </div>
              <p className="text-sm font-bold text-[var(--color-ink-secondary)]">Sin citas este día</p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">No hay citas agendadas</p>
            </div>
          ) : (
            dayAptsMobile.map(apt => {
              const cardCls = STATUS_CARD[apt.status as AppointmentStatus] ?? 'bg-gray-50 border-l-4 border-gray-300 text-gray-700'
              const dotCls  = STATUS_DOT[apt.status as AppointmentStatus]  ?? 'bg-gray-400'
              const label   = STATUS_LABEL[apt.status as AppointmentStatus] ?? apt.status
              return (
                <div key={apt.id} className={`rounded-2xl border border-[var(--color-border-soft)] px-4 py-3.5 shadow-sm ${cardCls}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-sm leading-tight">{apt.clients?.name ?? 'Cliente'}</p>
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 shrink-0 border border-white/40">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
                      {label}
                    </span>
                  </div>
                  <p className="text-xs font-semibold opacity-80">{apt.services?.name ?? ''}</p>
                  {apt.services?.description && (
                    <p className="text-[11px] opacity-60 mt-0.5 line-clamp-2 leading-relaxed">
                      {apt.services.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-2 opacity-70">
                    <Clock size={11} />
                    <p className="text-xs font-bold">
                      {apt.start_time.slice(0, 5)} – {apt.end_time.slice(0, 5)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Strip de días de la semana */}
        <div className="border-t border-[var(--color-border)] bg-[var(--color-cream)] px-3 py-2.5">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <button
              onClick={() => navigateWeek(-1)}
              className="text-[10px] text-[var(--color-ink-muted)] font-bold hover:text-[var(--color-navy)] transition-colors"
            >
              ← ant.
            </button>
            <span className="text-[10px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
              {new Date(weekDates[0]! + 'T12:00').toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateWeek(1)}
              className="text-[10px] text-[var(--color-ink-muted)] font-bold hover:text-[var(--color-navy)] transition-colors"
            >
              sig. →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((date, i) => {
              const isToday    = date === today
              const isSelected = date === selectedDate
              const hasApts    = appointments.some(a => a.date === date)
              return (
                <button
                  key={date}
                  onClick={() => router.push(`/admin/calendario?fecha=${date}`)}
                  className={[
                    'flex flex-col items-center py-1.5 rounded-xl transition-all',
                    isSelected
                      ? 'bg-[var(--color-navy)] text-white'
                      : isToday
                      ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary-dark)]'
                      : 'text-[var(--color-ink-secondary)] hover:bg-white',
                  ].join(' ')}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wide">{DAYS_ES[i]}</span>
                  <span className="text-sm font-bold leading-tight">{new Date(date + 'T12:00').getDate()}</span>
                  <span className={[
                    'w-1 h-1 rounded-full mt-0.5',
                    hasApts
                      ? isSelected ? 'bg-white/60' : 'bg-[var(--color-primary)]'
                      : 'bg-transparent',
                  ].join(' ')} />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          DESKTOP — Grid semanal
      ═══════════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col flex-1">

        {/* Header nav */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] transition-all"
          >
            <ChevronLeft size={18} className="text-[var(--color-navy)]" />
          </button>
          <span className="text-base font-bold text-[var(--color-navy)] tracking-tight">
            {new Date(weekDates[0]! + 'T12:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
            {' – '}
            {new Date(weekDates[6]! + 'T12:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] transition-all"
          >
            <ChevronRight size={18} className="text-[var(--color-navy)]" />
          </button>
        </div>

        {/* Cabecera de columnas */}
        <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-[var(--color-border)]">
          <div />
          {weekDates.map((date, i) => {
            const isToday = date === today
            return (
              <div
                key={date}
                className={`py-3 text-center border-l border-[var(--color-border-soft)] ${isToday ? 'bg-[var(--color-primary-light)]/15' : ''}`}
              >
                <p className="text-[11px] font-bold text-[var(--color-ink-secondary)] uppercase tracking-[0.12em]">
                  {DAYS_ES[i]}
                </p>
                <p className={`text-xl font-bold mt-1 ${isToday ? 'text-[var(--color-primary-dark)]' : 'text-[var(--color-navy)]'}`}>
                  {new Date(date + 'T12:00').getDate()}
                </p>
              </div>
            )
          })}
        </div>

        {/* Grid de horas */}
        <div className="overflow-y-auto flex-1">
          <div
            className="grid grid-cols-[56px_repeat(7,1fr)]"
            style={{ height: `${CELL_H * HOURS.length}px` }}
          >
            {/* Labels de hora */}
            <div className="relative">
              {HOURS.map(h => (
                <div
                  key={h}
                  className="absolute w-full flex items-start justify-end pr-3"
                  style={{ top: `${(h - 8) * CELL_H}px`, height: `${CELL_H}px` }}
                >
                  <span className="text-[10px] text-[var(--color-ink-secondary)] font-bold mt-1.5">
                    {h}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Columnas de días */}
            {weekDates.map((date) => {
              const dayApts = appointments.filter(a => a.date === date)
              const isToday = date === today
              return (
                <div
                  key={date}
                  className={`relative border-l border-[var(--color-border-soft)] ${isToday ? 'bg-[var(--color-primary-light)]/5' : ''}`}
                >
                  {/* Líneas de hora */}
                  {HOURS.map(h => (
                    <div
                      key={h}
                      className="absolute w-full border-t border-[var(--color-border-soft)]"
                      style={{ top: `${(h - 8) * CELL_H}px` }}
                    />
                  ))}

                  {/* Citas */}
                  {dayApts.map(apt => {
                    const top    = timeToMinutes(apt.start_time) / 60 * CELL_H
                    const height = Math.max(
                      (timeToMinutes(apt.end_time) - timeToMinutes(apt.start_time)) / 60 * CELL_H,
                      44
                    )
                    const colorCls = STATUS_GRID[apt.status as AppointmentStatus] ?? 'bg-gray-50 border-gray-200 text-gray-700'
                    return (
                      <div
                        key={apt.id}
                        className={`absolute left-1 right-1 rounded-xl border px-2 py-1.5 overflow-hidden cursor-default shadow-sm transition-all hover:shadow-md hover:scale-[1.01] hover:z-10 ${colorCls}`}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        title={`${apt.clients?.name ?? ''} — ${apt.services?.name ?? ''}`}
                      >
                        <p className="text-[11px] font-bold truncate leading-tight">
                          {apt.clients?.name ?? 'Cliente'}
                        </p>
                        <p className="text-[10px] font-semibold truncate leading-tight mt-0.5 opacity-80">
                          {apt.services?.name ?? ''}
                        </p>
                        {apt.services?.description && height > 68 && (
                          <p className="text-[9px] truncate leading-tight mt-0.5 opacity-55">
                            {apt.services.description}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
