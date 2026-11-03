import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendRecordatorio } from '@/lib/resend/emails'
import { tomorrowInBusinessTz } from '@/lib/tz'

/**
 * Recordatorios del día siguiente. Lo llama el cron de Vercel una vez al día
 * (vercel.json). Vercel manda `Authorization: Bearer $CRON_SECRET`; sin ese
 * secreto nadie de afuera puede disparar envíos.
 *
 * Es seguro ejecutarlo varias veces: cada cita guarda `reminder_sent_at` y no
 * se le vuelve a escribir.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const fecha = tomorrowInBusinessTz()

  const { data: citas, error } = await supabase
    .from('appointments')
    .select('id, date, start_time, manage_token, clients(name, email), services(name)')
    .eq('date', fecha)
    .in('status', ['pending', 'confirmed'])
    .is('reminder_sent_at', null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let enviados = 0
  let fallidos = 0
  for (const c of citas ?? []) {
    const client  = c.clients  as { name: string; email: string | null } | null
    const service = c.services as { name: string } | null
    if (!client?.email) continue

    try {
      const ok = await sendRecordatorio({
        to:          client.email,
        clientName:  client.name,
        serviceName: service?.name ?? 'tu servicio',
        date:        c.date,
        startTime:   c.start_time,
        manageToken: c.manage_token,
      })
      if (!ok) { fallidos++; continue }
      await supabase.from('appointments').update({ reminder_sent_at: new Date().toISOString() }).eq('id', c.id)
      enviados++
    } catch {
      fallidos++
    }
  }

  return NextResponse.json({ fecha, enviados, fallidos })
}
