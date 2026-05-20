'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type DaySchedule = {
  day_of_week:  number
  start_time_1: string
  end_time_1:   string
  start_time_2: string | null
  end_time_2:   string | null
  is_active:    boolean
}

export async function saveBusinessHours(schedules: DaySchedule[]) {
  const supabase = await createClient()
  // Convertir strings vacíos a null en los campos del segundo turno
  const cleaned = schedules.map(s => ({
    ...s,
    start_time_2: s.start_time_2 || null,
    end_time_2:   s.end_time_2   || null,
  }))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('business_hours')
    .upsert(cleaned, { onConflict: 'day_of_week' })
  if (error) return { error: error.message }
  revalidatePath('/admin/horario')
  return { success: true }
}
