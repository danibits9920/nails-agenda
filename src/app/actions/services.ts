'use server'
import { requireAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'

// Tipos de imagen permitidos para subir (evita SVG con script → XSS,
// ya que el bucket es público y se sirve por URL directa).
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  const { error } = await supabase
    .from('services')
    .update({ is_active: isActive })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/servicios')
  return { success: true }
}

export async function upsertService(formData: FormData) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  const id = formData.get('id') as string | null

  const name     = (formData.get('name') as string ?? '').trim()
  const category = (formData.get('category') as string ?? '').trim()
  const duration = Number(formData.get('duration_minutes'))
  const price    = Number(formData.get('price'))

  if (!name)     return { error: 'El nombre del servicio es requerido.' }
  if (!category) return { error: 'La categoría es requerida.' }
  if (!Number.isFinite(duration) || duration <= 0) {
    return { error: 'La duración debe ser un número mayor a 0.' }
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: 'El precio debe ser un número válido.' }
  }

  const data = {
    name,
    description:      formData.get('description') as string || null,
    category,
    duration_minutes: duration,
    price,
    is_active:        true,
  }

  const { error } = id
    ? await supabase.from('services').update(data).eq('id', id)
    : await supabase.from('services').insert(data)

  if (error) return { error: error.message }
  revalidatePath('/admin/servicios')
  return { success: true }
}

export async function uploadServiceImage(serviceId: string, formData: FormData) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'No se recibió archivo' }
  if (file.size > 2 * 1024 * 1024) return { error: 'El archivo supera 2 MB' }

  // Validar el tipo real del archivo, no la extensión del nombre.
  const ext = ALLOWED_IMAGE_TYPES[file.type]
  if (!ext) {
    return { error: 'Formato no permitido. Sube una imagen JPG, PNG o WebP.' }
  }
  const path = `${serviceId}/${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('service-images')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('service-images')
    .getPublicUrl(path)

  const { error: dbError } = await supabase
    .from('service_images')
    .insert({ service_id: serviceId, storage_path: path, url: publicUrl })

  if (dbError) {
    await supabase.storage.from('service-images').remove([path])
    return { error: dbError.message }
  }

  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')
  return { success: true }
}

export async function deleteServiceImage(id: string, storagePath: string) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate

  await supabase.storage.from('service-images').remove([storagePath])

  const { error } = await supabase
    .from('service_images')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')
  return { success: true }
}
