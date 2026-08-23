'use server'
import { requireAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'
import type { AppointmentStatus } from '@/types/database'
import { mensajeDeError } from '@/lib/errors'

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
  if (error) {
    return { error: mensajeDeError(error, 'No se pudo cambiar el estado de la cita. Intenta de nuevo.') }
  }
  revalidatePath('/admin/citas')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/calendario')
  return { success: true }
}

export async function updatePaymentStatus(appointmentId: string, paymentStatus: 'unpaid' | 'pending_verification' | 'paid') {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  const { error } = await supabase
    .from('appointments')
    .update({ payment_status: paymentStatus })
    .eq('id', appointmentId)
  if (error) {
    return { error: mensajeDeError(error, 'No se pudo cambiar el estado del pago.') }
  }
  revalidatePath('/admin/citas')
  revalidatePath('/admin/pagos')
  return { success: true }
}
