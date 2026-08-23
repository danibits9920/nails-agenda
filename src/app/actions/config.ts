'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'
import { mensajeDeError } from '@/lib/errors'

export async function toggleMaintenance(enabled: boolean) {
  // Esta action usa el cliente service-role (bypassa RLS), así que la
  // verificación de sesión aquí es la ÚNICA red de seguridad. Sin ella,
  // cualquiera podría activar el modo mantenimiento y tumbar el sitio.
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('site_config')
    .upsert({ key: 'maintenance_mode', value: String(enabled) }, { onConflict: 'key' })

  if (error) {
    return {
      error: mensajeDeError(error, enabled
        ? 'No se pudo activar el modo mantenimiento. El sitio sigue visible.'
        : 'No se pudo desactivar el modo mantenimiento. El sitio sigue en pausa.'),
    }
  }
  revalidatePath('/admin/configuracion')
  revalidatePath('/', 'layout')
  return { success: true }
}
