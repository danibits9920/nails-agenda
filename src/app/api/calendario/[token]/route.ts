import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { icsCita, ICS_FILENAME } from '@/lib/calendario'
import { manageUrl } from '@/lib/resend/emails'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Archivo de calendario (.ics) de una cita, para iPhone y Outlook.
 * Se identifica con el enlace privado de la clienta, no con el id de la cita:
 * nadie puede recorrer citas ajenas probando números.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!UUID.test(token)) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { data: apt } = await createAdminClient()
    .from('appointments')
    .select('id, date, start_time, end_time, status, services(name)')
    .eq('manage_token', token)
    .maybeSingle()

  if (!apt || !['pending', 'confirmed'].includes(apt.status)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const ics = icsCita({
    uid:         apt.id,
    serviceName: (apt.services as { name: string } | null)?.name ?? 'Tu cita',
    date:        apt.date,
    startTime:   apt.start_time,
    endTime:     apt.end_time,
    manageUrl:   manageUrl(token),
  })

  return new NextResponse(ics, {
    headers: {
      'Content-Type':        'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${ICS_FILENAME}"`,
      'Cache-Control':       'no-store',
    },
  })
}
