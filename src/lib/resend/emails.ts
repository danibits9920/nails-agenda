import { resend, FROM } from './client'
import { templateConfirmacion, templateRecordatorio, templatePagoVerificado, templateNuevaReservaAdmin, templateCancelacionAdmin } from './templates'
import { createAdminClient } from '@/lib/supabase/admin'
import { ADMIN_BASE } from '@/lib/admin-path'
import { googleCalendarUrl, icsCita, ICS_FILENAME } from '@/lib/calendario'

const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

/** Enlace privado con el que la clienta cancela o cambia su hora. */
export const manageUrl = (token: string) => `${APP_URL()}/reservar/gestionar/${token}`

const calendarUrl = (date: string) => `${APP_URL()}${ADMIN_BASE}/calendario?fecha=${date}`

const emailOn = () => !!process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_XXX')

/**
 * Un correo por persona: si uno de los destinos se rechaza (p. ej. en el
 * modo de prueba de Resend, que sólo entrega a la dueña de la cuenta),
 * el resto igual recibe el aviso.
 */
async function sendToEach(to: string[], subject: string, html: string) {
  await Promise.allSettled(to.map(addr => resend.emails.send({ from: FROM, to: addr, subject, html })))
}

async function adminEmails(): Promise<string[]> {
  const { data } = await createAdminClient().auth.admin.listUsers({ perPage: 100 })
  return (data?.users ?? []).map(u => u.email).filter((e): e is string => !!e)
}
import { formatCLP, formatDate, formatTime } from '@/lib/utils'

export async function sendConfirmacion(data: {
  to: string
  clientName: string
  serviceName: string
  date: string
  startTime: string
  endTime: string
  price: number
  paymentStatus: string
  manageToken: string
  appointmentId: string
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_XXX')) return

  const cita = {
    uid:         data.appointmentId,
    serviceName: data.serviceName,
    date:        data.date,
    startTime:   data.startTime,
    endTime:     data.endTime,
    manageUrl:   manageUrl(data.manageToken),
  }

  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: '✦ Tu cita está reservada — Nails Yurany',
    // El .ics adjunto es el camino de iPhone y Outlook; Google usa su enlace.
    attachments: [{ filename: ICS_FILENAME, content: Buffer.from(icsCita(cita)), contentType: 'text/calendar' }],
    html: templateConfirmacion({
      googleCalendarUrl: googleCalendarUrl(cita),
      icsUrl:            `${APP_URL()}/api/calendario/${data.manageToken}`,
      clientName:    data.clientName,
      serviceName:   data.serviceName,
      date:          formatDate(data.date),
      time:          formatTime(data.startTime),
      price:         formatCLP(data.price),
      paymentStatus: data.paymentStatus,
      manageUrl:     manageUrl(data.manageToken),
    }),
  })
}

export async function sendRecordatorio(data: {
  to: string
  clientName: string
  serviceName: string
  date: string
  startTime: string
  manageToken: string
}) {
  if (!emailOn()) return false

  const { error } = await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: 'Recordatorio: Tu cita es mañana — Nails Yurany',
    html: templateRecordatorio({
      clientName:  data.clientName,
      serviceName: data.serviceName,
      date:        formatDate(data.date),
      time:        formatTime(data.startTime),
      manageUrl:   manageUrl(data.manageToken),
    }),
  })
  return !error
}

export async function sendPagoVerificado(data: {
  to: string
  clientName: string
  serviceName: string
  date: string
  startTime: string
  price: number
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_XXX')) return

  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: '¡Pago confirmado! Tu cita está confirmada — Nails Yurany',
    html: templatePagoVerificado({
      clientName:  data.clientName,
      serviceName: data.serviceName,
      date:        formatDate(data.date),
      time:        formatTime(data.startTime),
      price:       formatCLP(data.price),
    }),
  })
}

/**
 * Avisa de una reserva nueva a todas las cuentas del panel.
 * Las destinatarias son las usuarias de Supabase Auth: quien tenga acceso
 * al dashboard recibe el aviso, sin lista aparte que mantener.
 */
export async function sendAvisoNuevaReserva(data: {
  clientName: string
  email: string | null
  phone: string | null
  serviceName: string
  date: string
  startTime: string
  price: number
  payMethod: string
  notes: string | null
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_XXX')) return

  const to = await adminEmails()
  if (to.length === 0) return
  const payment = data.payMethod === 'transfer' ? 'Transferencia (por verificar)' : 'Presencial'

  await sendToEach(to, `Nueva reserva: ${data.clientName} · ${formatDate(data.date)} ${formatTime(data.startTime)}`, templateNuevaReservaAdmin({
      clientName:    data.clientName,
      clientContact: [data.email, data.phone].filter(Boolean).join(' · ') || 'Sin datos',
      serviceName:   data.serviceName,
      date:          formatDate(data.date),
      time:          formatTime(data.startTime),
      price:         formatCLP(data.price),
      payment,
      notes:         data.notes,
      calendarUrl:   calendarUrl(data.date),
    }))
}

/** Avisa al equipo del panel que una clienta canceló desde su enlace. */
export async function sendAvisoCancelacion(data: {
  clientName: string
  serviceName: string
  date: string
  startTime: string
}) {
  if (!emailOn()) return
  const to = await adminEmails()
  if (to.length === 0) return

  await sendToEach(to, `Cancelación: ${data.clientName} · ${formatDate(data.date)} ${formatTime(data.startTime)}`, templateCancelacionAdmin({
      clientName:  data.clientName,
      serviceName: data.serviceName,
      date:        formatDate(data.date),
      time:        formatTime(data.startTime),
      calendarUrl: calendarUrl(data.date),
    }))
}
