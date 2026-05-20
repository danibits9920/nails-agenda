'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AppointmentStatus } from '@/types/database'

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/citas')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function updatePaymentStatus(appointmentId: string, paymentStatus: 'unpaid' | 'pending_verification' | 'paid') {
  const supabase = await createClient()
  const { error } = await supabase
    .from('appointments')
    .update({ payment_status: paymentStatus })
    .eq('id', appointmentId)
  if (error) return { error: error.message }
  revalidatePath('/admin/citas')
  revalidatePath('/admin/pagos')
  return { success: true }
}
