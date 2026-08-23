'use server'
import { requireAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'
import { sendPagoVerificado } from '@/lib/resend/emails'
import { mensajeDeError } from '@/lib/errors'

export async function verifyPayment(paymentId: string, appointmentId: string) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from('payments').update({ status: 'verified' }).eq('id', paymentId),
    supabase.from('appointments').update({ payment_status: 'paid', status: 'confirmed' }).eq('id', appointmentId),
  ])
  if (e1 || e2) return { error: mensajeDeError(e1 ?? e2, 'No se pudo verificar el pago. Intenta de nuevo.') }

  try {
    const { data } = await supabase
      .from('appointments')
      .select('date, start_time, clients(name, email), services(name, price)')
      .eq('id', appointmentId)
      .single()

    const client  = data?.clients  as { name: string; email: string | null } | null
    const service = data?.services as { name: string; price: number } | null

    if (data && client?.email && service) {
      await sendPagoVerificado({
        to:          client.email,
        clientName:  client.name,
        serviceName: service.name,
        date:        data.date,
        startTime:   data.start_time,
        price:       service.price,
      })
    }
  } catch { /* el email no bloquea la verificación */ }

  revalidatePath('/admin/pagos')
  revalidatePath('/admin/citas')
  return { success: true }
}

export async function rejectPayment(paymentId: string, appointmentId?: string) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate

  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId)
  if (error) {
    return { error: mensajeDeError(error, 'No se pudo rechazar el pago. Intenta de nuevo.') }
  }

  // Rechazar el pago dejaba la cita en 'pending_verification' para siempre:
  // el comprobante quedaba rechazado pero la cita seguía diciendo "Por
  // verificar", sin forma de salir de ese estado desde la interfaz.
  if (appointmentId) {
    const { error: aptError } = await supabase
      .from('appointments')
      .update({ payment_status: 'unpaid' })
      .eq('id', appointmentId)
    if (aptError) {
      return {
        error: 'El pago se rechazó, pero la cita quedó marcada como "Por verificar". Cámbiala a mano en Citas.',
      }
    }
  }

  revalidatePath('/admin/pagos')
  revalidatePath('/admin/citas')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
