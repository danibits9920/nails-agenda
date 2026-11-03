'use server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendAvisoCancelacion } from '@/lib/resend/emails'
import { hoursUntilInBusinessTz } from '@/lib/tz'
import { MIN_HORAS_CANCELAR } from '@/lib/politicas'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Cancela la cita del enlace. Con `cambiar`, además lleva a elegir otra hora
 * del mismo servicio: el horario anterior queda libre de inmediato.
 */
export async function cancelarCita(_prev: { error: string } | null, formData: FormData) {
  const token   = String(formData.get('token') ?? '')
  const cambiar = formData.get('cambiar') === '1'
  if (!UUID.test(token)) return { error: 'Enlace no válido.' }

  const supabase = createAdminClient()
  const { data: apt } = await supabase
    .from('appointments')
    .select('id, date, start_time, status, service_id, clients(name), services(name)')
    .eq('manage_token', token)
    .maybeSingle()

  if (!apt) return { error: 'No encontramos esta cita.' }
  if (!['pending', 'confirmed'].includes(apt.status)) {
    return { error: 'Esta cita ya no se puede modificar.' }
  }
  if (hoursUntilInBusinessTz(apt.date, apt.start_time) < MIN_HORAS_CANCELAR) {
    return { error: `Faltan menos de ${MIN_HORAS_CANCELAR} horas. Para cambios, escríbenos directamente.` }
  }

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', apt.id)
    .in('status', ['pending', 'confirmed'])
  if (error) return { error: 'No se pudo cancelar. Intenta de nuevo.' }

  try {
    await sendAvisoCancelacion({
      clientName:  (apt.clients as { name: string } | null)?.name ?? 'Una clienta',
      serviceName: (apt.services as { name: string } | null)?.name ?? '—',
      date:        apt.date,
      startTime:   apt.start_time,
    })
  } catch { /* el aviso no bloquea la cancelación */ }

  if (cambiar && apt.service_id) redirect(`/reservar/horario?service=${apt.service_id}`)
  redirect(`/reservar/gestionar/${token}`)
}
