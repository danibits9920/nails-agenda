'use server'
import { requireAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'
import { mensajeDeError } from '@/lib/errors'

export type DaySchedule = {
  day_of_week:  number
  start_time_1: string
  end_time_1:   string
  start_time_2: string | null
  end_time_2:   string | null
  is_active:    boolean
}

export async function saveBusinessHours(schedules: DaySchedule[]) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  // Convertir strings vacíos a null en los campos del segundo turno
  const cleaned = schedules.map(s => ({
    ...s,
    start_time_2: s.start_time_2 || null,
    end_time_2:   s.end_time_2   || null,
  }))
  // La base tiene constraints para esto, pero su error llega como
  // «violates check constraint bh_shift1_check», que no le dice a nadie qué
  // día está mal. Se valida aquí para poder nombrar el día y el turno.
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  for (const s of cleaned) {
    const dia = DIAS[s.day_of_week] ?? `día ${s.day_of_week}`
    if (!s.is_active) continue
    if (s.end_time_1 <= s.start_time_1) {
      return { error: `El turno 1 del ${dia} termina antes de empezar. Revisa las horas.` }
    }
    if (s.start_time_2 && s.end_time_2) {
      if (s.end_time_2 <= s.start_time_2) {
        return { error: `El turno 2 del ${dia} termina antes de empezar. Revisa las horas.` }
      }
      if (s.start_time_2 < s.end_time_1) {
        return { error: `Los dos turnos del ${dia} se pisan. El turno 2 debe empezar después de que termine el turno 1.` }
      }
    }
    if ((s.start_time_2 && !s.end_time_2) || (!s.start_time_2 && s.end_time_2)) {
      return { error: `Al turno 2 del ${dia} le falta una hora. Complétalo o quítalo.` }
    }
  }

  const { error } = await supabase
    .from('business_hours')
    .upsert(cleaned, { onConflict: 'day_of_week' })
  if (error) {
    return { error: mensajeDeError(error, 'No se pudo guardar el horario. Intenta de nuevo.') }
  }
  revalidatePath('/admin/horario')
  revalidatePath('/reservar/horario')
  return { success: true }
}
