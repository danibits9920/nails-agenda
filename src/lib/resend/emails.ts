import { resend, FROM } from './client'
import { templateConfirmacion, templateRecordatorio, templatePagoVerificado } from './templates'
import { formatCLP, formatDate, formatTime } from '@/lib/utils'

export async function sendConfirmacion(data: {
  to: string
  clientName: string
  serviceName: string
  date: string
  startTime: string
  price: number
  paymentStatus: string
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_XXX')) return

  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: '✦ Tu cita está reservada — Nails Art Yurany',
    html: templateConfirmacion({
      clientName:    data.clientName,
      serviceName:   data.serviceName,
      date:          formatDate(data.date),
      time:          formatTime(data.startTime),
      price:         formatCLP(data.price),
      paymentStatus: data.paymentStatus,
    }),
  })
}

export async function sendRecordatorio(data: {
  to: string
  clientName: string
  serviceName: string
  date: string
  startTime: string
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_XXX')) return

  await resend.emails.send({
    from: FROM,
    to: data.to,
    subject: 'Recordatorio: Tu cita es mañana — Nails Art Yurany',
    html: templateRecordatorio({
      clientName:  data.clientName,
      serviceName: data.serviceName,
      date:        formatDate(data.date),
      time:        formatTime(data.startTime),
    }),
  })
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
    subject: '¡Pago confirmado! Tu cita está confirmada — Nails Art Yurany',
    html: templatePagoVerificado({
      clientName:  data.clientName,
      serviceName: data.serviceName,
      date:        formatDate(data.date),
      time:        formatTime(data.startTime),
      price:       formatCLP(data.price),
    }),
  })
}
