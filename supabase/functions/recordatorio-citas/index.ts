import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY    = Deno.env.get('RESEND_API_KEY')!
const FROM              = Deno.env.get('RESEND_FROM_EMAIL') ?? 'Nails Art Yurany <no-reply@nailsartyurany.cl>'

function tomorrowChile(): string {
  // Chile es UTC-4 (permanente desde 2015). Sumamos 20h para que al correr a las 13:00 UTC
  // (10:00 AM Chile) obtengamos la fecha de mañana en Chile.
  const now = new Date()
  now.setUTCHours(now.getUTCHours() - 4) // ajuste a hora Chile
  now.setUTCDate(now.getUTCDate() + 1)
  return now.toISOString().slice(0, 10)
}

function htmlRecordatorio(clientName: string, serviceName: string, date: string, time: string): string {
  const dateFormatted = new Intl.DateTimeFormat('es-CL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Santiago',
  }).format(new Date(`${date}T12:00:00`))

  const [h, m] = time.split(':')
  const timeFormatted = `${h}:${m}`

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFF8F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F8;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="background:linear-gradient(135deg,#F5C0C0,#D4BCEC);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.35);display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
            <span style="font-size:20px;">✦</span>
          </div>
          <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:600;color:#1A2040;letter-spacing:-0.3px;">Nails Art Yurany</h1>
        </td></tr>
        <tr><td style="background:#FFFFFF;padding:36px 40px;border-left:1px solid #F0E8E8;border-right:1px solid #F0E8E8;">
          <h2 style="margin:0 0 6px;font-family:Georgia,serif;font-size:24px;color:#1A2040;">Tu cita es mañana ⏰</h2>
          <p style="margin:0 0 28px;font-size:15px;color:#4A5270;">Hola <strong>${clientName}</strong>, te recordamos tu cita de mañana.</p>
          <div style="background:#FFF8F8;border:1px solid #F0E8E8;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;vertical-align:top;"><span style="font-size:14px;">✂️</span></td>
                <td style="padding:8px 12px 8px 8px;vertical-align:top;width:110px;"><span style="font-size:12px;font-weight:600;color:#8A91AD;text-transform:uppercase;letter-spacing:0.5px;">Servicio</span></td>
                <td style="padding:8px 0;vertical-align:top;"><span style="font-size:14px;color:#1A2040;font-weight:500;">${serviceName}</span></td>
              </tr>
              <tr>
                <td style="padding:8px 0;vertical-align:top;"><span style="font-size:14px;">📅</span></td>
                <td style="padding:8px 12px 8px 8px;vertical-align:top;width:110px;"><span style="font-size:12px;font-weight:600;color:#8A91AD;text-transform:uppercase;letter-spacing:0.5px;">Fecha</span></td>
                <td style="padding:8px 0;vertical-align:top;"><span style="font-size:14px;color:#1A2040;font-weight:500;">${dateFormatted}</span></td>
              </tr>
              <tr>
                <td style="padding:8px 0;vertical-align:top;"><span style="font-size:14px;">🕐</span></td>
                <td style="padding:8px 12px 8px 8px;vertical-align:top;width:110px;"><span style="font-size:12px;font-weight:600;color:#8A91AD;text-transform:uppercase;letter-spacing:0.5px;">Hora</span></td>
                <td style="padding:8px 0;vertical-align:top;"><span style="font-size:14px;color:#1A2040;font-weight:500;">${timeFormatted}</span></td>
              </tr>
            </table>
          </div>
          <p style="margin:0;font-size:14px;color:#8A91AD;">Si no puedes asistir, por favor avísanos con anticipación. ¡Te esperamos!</p>
        </td></tr>
        <tr><td style="background:#FEF5F7;border:1px solid #F0E8E8;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#B8BCCF;">Nails Art Yurany · Chile</p>
          <p style="margin:4px 0 0;font-size:11px;color:#B8BCCF;">Este es un correo automático, no respondas a este mensaje.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

serve(async () => {
  const tomorrow = tomorrowChile()

  // Citas de mañana que no estén canceladas ni rechazadas
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/appointments?select=date,start_time,clients(name,email),services(name)&date=eq.${tomorrow}&status=not.in.(cancelled,no_show)&payment_status=neq.rejected`,
    {
      headers: {
        apikey:        SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
    }
  )

  if (!res.ok) {
    const text = await res.text()
    return new Response(JSON.stringify({ error: text }), { status: 500 })
  }

  type Row = {
    date: string
    start_time: string
    clients: { name: string; email: string | null } | null
    services: { name: string } | null
  }

  const appointments: Row[] = await res.json()
  let sent = 0
  let skipped = 0

  for (const apt of appointments) {
    const email = apt.clients?.email
    if (!email) { skipped++; continue }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    FROM,
        to:      email,
        subject: 'Recordatorio: Tu cita es mañana — Nails Art Yurany',
        html:    htmlRecordatorio(
          apt.clients!.name,
          apt.services?.name ?? 'Servicio',
          apt.date,
          apt.start_time,
        ),
      }),
    })

    sent++
  }

  return new Response(JSON.stringify({ tomorrow, sent, skipped }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
