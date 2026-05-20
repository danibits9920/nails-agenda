'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { sendConfirmacion } from '@/lib/resend/emails'

export async function crearReserva(_prevState: { error: string } | null, formData: FormData) {
  const serviceId = formData.get('service_id') as string
  const fecha     = formData.get('fecha') as string
  const startTime = formData.get('start_time') as string
  const endTime   = formData.get('end_time') as string
  const name      = (formData.get('name') as string).trim()
  const email     = (formData.get('email') as string | null)?.trim() || null
  const phone     = (formData.get('phone') as string | null)?.trim() || null
  const notes     = (formData.get('notes') as string | null)?.trim() || null
  const payMethod = formData.get('pay_method') as string

  if (!serviceId || !fecha || !startTime || !endTime || !name) {
    return { error: 'Faltan datos requeridos.' }
  }

  const supabase = createAdminClient()

  // 1. Crear o encontrar el cliente por email/teléfono
  let clientId: string

  if (email) {
    const { data: existing } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      clientId = existing.id
    } else {
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert({ name, email, phone })
        .select('id')
        .single()
      if (error || !newClient) return { error: 'Error al registrar cliente.' }
      clientId = newClient.id
    }
  } else {
    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({ name, phone })
      .select('id')
      .single()
    if (error || !newClient) return { error: 'Error al registrar cliente.' }
    clientId = newClient.id
  }

  // 2. Crear la cita
  const { data: apt, error: aptError } = await supabase
    .from('appointments')
    .insert({
      client_id:      clientId,
      service_id:     serviceId,
      date:           fecha,
      start_time:     startTime,
      end_time:       endTime,
      notes,
      status:         'pending',
      payment_status: payMethod === 'presencial' ? 'unpaid' : 'pending_verification',
    })
    .select('id')
    .single()

  if (aptError || !apt) return { error: 'Error al crear la cita.' }

  // 3. Datos del servicio (necesarios para pago y email)
  const { data: service } = await supabase
    .from('services')
    .select('name, price')
    .eq('id', serviceId)
    .single()

  // 4. Registrar pago si es transferencia manual
  if (payMethod === 'transfer' && service) {
    await supabase.from('payments').insert({
      appointment_id: apt.id,
      method:         'transfer',
      amount:         service.price,
      status:         'pending',
    })
  }

  // 5. Email de confirmación
  if (email && service) {
    await sendConfirmacion({
      to:            email,
      clientName:    name,
      serviceName:   service.name,
      date:          fecha,
      startTime,
      price:         service.price,
      paymentStatus: payMethod === 'transfer' ? 'pending_verification' : 'unpaid',
    })
  }

  redirect(`/reservar/confirmacion?id=${apt.id}`)
}
