import { todayInBusinessTz } from '@/lib/tz'
import { createClient } from '@/lib/supabase/server'
import CalendarWeek from './CalendarWeek'

export default async function CalendarioPage({ searchParams }: { searchParams: Promise<{ fecha?: string }> }) {
  const { fecha } = await searchParams
  const supabase = await createClient()

  // Todo en UTC a mediodía: así ni la zona del servidor ni la de Chile mueven
  // la fecha al día anterior (antes un lunes abría la semana previa).
  const base = /^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '') ? fecha! : todayInBusinessTz()
  const anchor = new Date(`${base}T12:00:00Z`)
  const day = anchor.getUTCDay()
  const monday = new Date(anchor)
  monday.setUTCDate(anchor.getUTCDate() - (day === 0 ? 6 : day - 1))

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setUTCDate(monday.getUTCDate() + i)
    return d.toISOString().split('T')[0]
  })

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, date, start_time, end_time, status, clients(name), services(name, description)')
    .gte('date', weekDates[0]!)
    .lte('date', weekDates[6]!)
    .not('status', 'in', '("cancelled","no_show")')
    .order('start_time')

  return (
    <div className="p-8 h-full flex flex-col space-y-6">
      <div>
        <h1 className="font-display text-page text-[var(--color-navy)]">Agenda semanal</h1>
      </div>
      <CalendarWeek
        weekDates={weekDates}
        appointments={appointments ?? []}
        anchorDate={anchor.toISOString().split('T')[0]!}
      />
    </div>
  )
}
