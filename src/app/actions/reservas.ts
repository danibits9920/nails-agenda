'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { sendConfirmacion } from '@/lib/resend/emails'
import { todayInBusinessTz, nowTimeInBusinessTz } from '@/lib/tz'

// Zona horaria del negocio: vive en @/lib/tz para que el panel y el flujo
// público no puedan divergir en qué día es "hoy".

const HHMM = (t: string) => t.slice(0, 5)

export async function crearReserva(_prevState: { error: string } | null, formData: FormData) {
  const serviceId = formData.get('service_id') as string
  const fecha     = formData.get('fecha') as string
  const startTime = formData.get('start_time') as string
  const name      = (formData.get('name') as string ?? '').trim()
  const email     = (formData.get('email') as string | null)?.trim() || null
  const phone     = (formData.get('phone') as string | null)?.trim() || null
  const notes     = (formData.get('notes') as string | null)?.trim() || null
  const payMethod = formData.get('pay_method') as string

  if (!serviceId || !fecha || !startTime || !name) {
    return { error: 'Faltan datos requeridos.' }
  }

  // Formato de email básico si se proporcionó
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'El email no tiene un formato válido.' }
  }

  const supabase = createAdminClient()

  // ── 1. Validar el servicio (existe y está activo) ─────────────────
  const { data: service } = await supabase
    .from('services')
    .select('name, price, duration_minutes, is_active')
    .eq('id', serviceId)
    .single()

  if (!service || !service.is_active) {
    return { error: 'El servicio seleccionado no está disponible.' }
  }

  // ── 2. Validar la fecha (no puede ser pasada) ─────────────────────
  const today = todayInBusinessTz()
  if (fecha < today) {
    return { error: 'La fecha seleccionada ya pasó. Elige otra.' }
  }

  // ── 3. Validar el horario contra la disponibilidad real ───────────
  // Re-ejecutamos get_available_slots en el servidor: así no confiamos
  // en el start_time que viaja por la URL, y detectamos slots que se
  // ocuparon entre la selección y el envío. El end_time lo tomamos del
  // slot devuelto, nunca del cliente.
  const { data: slots, error: slotsError } = await supabase.rpc('get_available_slots', {
    p_date: fecha,
    p_duration_mins: service.duration_minutes,
  })
  if (slotsError) {
    return { error: 'No se pudo verificar la disponibilidad. Intenta de nuevo.' }
  }

  const match = (slots ?? []).find(s => HHMM(s.slot_start) === HHMM(startTime))
  if (!match) {
    return { error: 'Ese horario ya no está disponible. Vuelve a elegir uno.' }
  }

  // Si la reserva es para hoy, rechazar horas que ya pasaron
  if (fecha === today && HHMM(match.slot_start) <= HHMM(nowTimeInBusinessTz())) {
    return { error: 'Ese horario ya pasó. Elige uno más tarde.' }
  }

  const startTimeValidated = match.slot_start
  const endTimeValidated   = match.slot_end

  // ── 4. Crear o encontrar el cliente por email ─────────────────────
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

  // ── 5. Crear la cita (con datos validados en servidor) ────────────
  const { data: apt, error: aptError } = await supabase
    .from('appointments')
    .insert({
      client_id:      clientId,
      service_id:     serviceId,
      date:           fecha,
      start_time:     startTimeValidated,
      end_time:       endTimeValidated,
      notes,
      status:         'pending',
      payment_status: payMethod === 'presencial' ? 'unpaid' : 'pending_verification',
    })
    .select('id')
    .single()

  if (aptError || !apt) {
    // 23P01 = exclusion_violation → el constraint anti-solapamiento
    // rechazó la cita porque otra reserva tomó el horario primero.
    if (aptError?.code === '23P01') {
      return { error: 'Justo alguien más reservó ese horario. Elige otro, por favor.' }
    }
    return { error: 'Error al crear la cita.' }
  }

  // ── 6. Registrar pago si es transferencia manual ──────────────────
  if (payMethod === 'transfer') {
    await supabase.from('payments').insert({
      appointment_id: apt.id,
      method:         'transfer',
      amount:         service.price,
      status:         'pending',
    })
  }

  // ── 7. Email de confirmación (no bloquea la reserva si falla) ──────
  if (email) {
    try {
      await sendConfirmacion({
        to:            email,
        clientName:    name,
        serviceName:   service.name,
        date:          fecha,
        startTime:     startTimeValidated,
        price:         service.price,
        paymentStatus: payMethod === 'transfer' ? 'pending_verification' : 'unpaid',
      })
    } catch { /* el email no bloquea la confirmación */ }
  }

  redirect(`/reservar/confirmacion?id=${apt.id}`)
}
