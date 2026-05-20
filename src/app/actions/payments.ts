'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendPagoVerificado } from '@/lib/resend/emails'

export async function verifyPayment(paymentId: string, appointmentId: string) {
  const supabase = await createClient()
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from('payments').update({ status: 'verified' }).eq('id', paymentId),
    supabase.from('appointments').update({ payment_status: 'paid', status: 'confirmed' }).eq('id', appointmentId),
  ])
  if (e1 || e2) return { error: (e1 ?? e2)?.message }

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

export async function rejectPayment(paymentId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('payments')
    .update({ status: 'rejected' })
    .eq('id', paymentId)
  if (error) return { error: error.message }
  revalidatePath('/admin/pagos')
  return { success: true }
}
