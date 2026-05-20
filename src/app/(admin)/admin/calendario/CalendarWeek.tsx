'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AppointmentStatus } from '@/types/database'

const STATUS_BG: Record<AppointmentStatus, string> = {
  pending:     'bg-amber-100  border-amber-300  text-amber-800',
  confirmed:   'bg-blue-100   border-blue-300   text-blue-800',
  in_progress: 'bg-purple-100 border-purple-300 text-purple-800',
  completed:   'bg-green-100  border-green-300  text-green-800',
  cancelled:   'bg-gray-100   border-gray-300   text-gray-500',
  no_show:     'bg-red-100    border-red-300    text-red-700',
}

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9) // 09:00 – 19:00
const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

type Apt = {
  id: string
  date: string
  start_time: string
  end_time: string
  status: string
  clients: { name: string } | null
  services: { name: string } | null
}

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

  function navigate(delta: number) {
    const d = new Date(anchorDate)
    d.setDate(d.getDate() + delta * 7)
    router.push(`/admin/calendario?fecha=${d.toISOString().split('T')[0]}`)
  }

  function timeToMinutes(t: string) {
    const [h, m] = t.split(':').map(Number)
    return (h! - 9) * 60 + m!
  }

  const CELL_H = 56 // px per hour

  return (
    <div className="flex flex-col flex-1 bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden">
      {/* Header nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-raised)] transition-colors">
          <ChevronLeft size={18} className="text-[var(--color-ink-secondary)]" />
        </button>
        <span className="text-sm font-medium text-[var(--color-navy)]">
          {new Date(weekDates[0]!).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })} –{' '}
          {new Date(weekDates[6]!).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => navigate(1)} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-raised)] transition-colors">
          <ChevronRight size={18} className="text-[var(--color-ink-secondary)]" />
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-[var(--color-border)]">
        <div />
        {weekDates.map((date, i) => {
          const d = new Date(date)
          const isToday = date === today
          return (
            <div key={date} className={`py-3 text-center border-l border-[var(--color-border-soft)] ${isToday ? 'bg-[var(--color-surface-raised)]' : ''}`}>
              <p className="text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase">{DAYS_ES[i]}</p>
              <p className={`text-lg font-semibold mt-0.5 ${isToday ? 'text-[var(--color-dorado)]' : 'text-[var(--color-navy)]'}`}>
                {d.getDate()}
              </p>
            </div>
          )
        })}
      </div>

      {/* Grid */}
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-[48px_repeat(7,1fr)]" style={{ height: `${CELL_H * HOURS.length}px` }}>
          {/* Hour labels */}
          <div className="relative">
            {HOURS.map(h => (
              <div key={h} className="absolute w-full flex items-start justify-end pr-2" style={{ top: `${(h - 9) * CELL_H}px`, height: `${CELL_H}px` }}>
                <span className="text-[10px] text-[var(--color-ink-muted)] font-medium mt-1">{h}:00</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, colIdx) => {
            const dayApts = appointments.filter(a => a.date === date)
            return (
              <div key={date} className="relative border-l border-[var(--color-border-soft)]">
                {/* Hour lines */}
                {HOURS.map(h => (
                  <div key={h} className="absolute w-full border-t border-[var(--color-border-soft)]" style={{ top: `${(h - 9) * CELL_H}px` }} />
                ))}
                {/* Appointments */}
                {dayApts.map((apt) => {
                  const top    = timeToMinutes(apt.start_time) / 60 * CELL_H
                  const height = Math.max(
                    (timeToMinutes(apt.end_time) - timeToMinutes(apt.start_time)) / 60 * CELL_H,
                    28
                  )
                  const colorCls = STATUS_BG[apt.status as AppointmentStatus] ?? 'bg-gray-100 border-gray-300 text-gray-700'
                  return (
                    <div
                      key={apt.id}
                      className={`absolute left-0.5 right-0.5 rounded-[var(--radius-sm)] border px-1.5 py-1 overflow-hidden cursor-default ${colorCls}`}
                      style={{ top: `${top}px`, height: `${height}px` }}
                      title={`${apt.clients?.name ?? ''} — ${apt.services?.name ?? ''}`}
                    >
                      <p className="text-[11px] font-semibold truncate leading-tight">{apt.clients?.name ?? 'Cliente'}</p>
                      <p className="text-[10px] truncate leading-tight opacity-80">{apt.services?.name ?? ''}</p>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
