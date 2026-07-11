'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function toggleMaintenance(enabled: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_config')
    .upsert({ key: 'maintenance_mode', value: String(enabled) }, { onConflict: 'key' })

  if (error) return { error: error.message }
  revalidatePath('/admin/configuracion')
  return { success: true }
}
