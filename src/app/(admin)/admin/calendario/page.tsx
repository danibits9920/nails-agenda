import { createClient } from '@/lib/supabase/server'
import CalendarWeek from './CalendarWeek'

export default async function CalendarioPage({ searchParams }: { searchParams: Promise<{ fecha?: string }> }) {
  const { fecha } = await searchParams
  const supabase = await createClient()

  const anchor = fecha ? new Date(fecha) : new Date()
  const day = anchor.getDay()
  const monday = new Date(anchor)
  monday.setDate(anchor.getDate() - (day === 0 ? 6 : day - 1))

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, date, start_time, end_time, status, clients(name), services(name)')
    .gte('date', weekDates[0]!)
    .lte('date', weekDates[6]!)
    .not('status', 'in', '("cancelled","no_show")')
    .order('start_time')

  return (
    <div className="p-8 h-full flex flex-col space-y-6">
      <div>
        <h1 className="font-display text-4.5xl font-bold text-[var(--color-navy)] tracking-tight">Calendario</h1>
      </div>
      <CalendarWeek
        weekDates={weekDates}
        appointments={appointments ?? []}
        anchorDate={anchor.toISOString().split('T')[0]!}
      />
    </div>
  )
}
