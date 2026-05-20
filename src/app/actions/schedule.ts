'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type DaySchedule = {
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export async function saveBusinessHours(schedules: DaySchedule[]) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('business_hours')
    .upsert(schedules, { onConflict: 'day_of_week' })
  if (error) return { error: error.message }
  revalidatePath('/admin/horario')
  return { success: true }
}
