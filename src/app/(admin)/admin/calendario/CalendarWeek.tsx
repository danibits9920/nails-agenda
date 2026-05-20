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
    <div className="flex flex-col flex-1 bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-sm">
      {/* Header nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <button onClick={() => navigate(-1)} className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] transition-all">
          <ChevronLeft size={18} className="text-[var(--color-navy)]" />
        </button>
        <span className="text-base font-bold text-[var(--color-navy)] tracking-tight">
          {new Date(weekDates[0]!).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })} –{' '}
          {new Date(weekDates[6]!).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => navigate(1)} className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] transition-all">
          <ChevronRight size={18} className="text-[var(--color-navy)]" />
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-[var(--color-border)]">
        <div />
        {weekDates.map((date, i) => {
          const d = new Date(date)
          const isToday = date === today
          return (
            <div key={date} className={`py-4.5 text-center border-l border-[var(--color-border-soft)] transition-colors ${isToday ? 'bg-[var(--color-primary-light)]/20' : ''}`}>
              <p className="text-[11px] font-bold text-[var(--color-ink-secondary)] uppercase tracking-[0.12em]">{DAYS_ES[i]}</p>
              <p className={`text-xl font-bold mt-1.5 ${isToday ? 'text-[var(--color-primary-dark)] scale-110' : 'text-[var(--color-navy)]'}`}>
                {d.getDate()}
              </p>
            </div>
          )
        })}
      </div>

      {/* Grid */}
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-[56px_repeat(7,1fr)]" style={{ height: `${CELL_H * HOURS.length}px` }}>
          {/* Hour labels */}
          <div className="relative">
            {HOURS.map(h => (
              <div key={h} className="absolute w-full flex items-start justify-end pr-3" style={{ top: `${(h - 9) * CELL_H}px`, height: `${CELL_H}px` }}>
                <span className="text-[10px] text-[var(--color-ink-secondary)] font-bold mt-1.5">{h}:00</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, colIdx) => {
            const dayApts = appointments.filter(a => a.date === date)
            const isToday = date === today
            return (
              <div key={date} className={`relative border-l border-[var(--color-border-soft)] ${isToday ? 'bg-[var(--color-primary-light)]/5' : ''}`}>
                {/* Hour lines */}
                {HOURS.map(h => (
                  <div key={h} className="absolute w-full border-t border-[var(--color-border-soft)]" style={{ top: `${(h - 9) * CELL_H}px` }} />
                ))}
                {/* Appointments */}
                {dayApts.map((apt) => {
                  const top    = timeToMinutes(apt.start_time) / 60 * CELL_H
                  const height = Math.max(
                    (timeToMinutes(apt.end_time) - timeToMinutes(apt.start_time)) / 60 * CELL_H,
                    36
                  )
                  const colorCls = STATUS_BG[apt.status as AppointmentStatus] ?? 'bg-gray-100 border-gray-300 text-gray-700'
                  return (
                    <div
                      key={apt.id}
                      className={`absolute left-1 right-1 rounded-[var(--radius-md)] border px-2 py-1.5 overflow-hidden cursor-default shadow-sm transition-all hover:shadow-md hover:scale-[1.02] hover:z-10 ${colorCls}`}
                      style={{ top: `${top}px`, height: `${height}px` }}
                      title={`${apt.clients?.name ?? ''} — ${apt.services?.name ?? ''}`}
                    >
                      <p className="text-[11px] font-bold truncate leading-tight">{apt.clients?.name ?? 'Cliente'}</p>
                      <p className="text-[10px] font-medium truncate leading-tight mt-0.5 opacity-90">{apt.services?.name ?? ''}</p>
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
