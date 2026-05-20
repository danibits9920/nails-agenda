'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleServiceActive(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('services')
    .update({ is_active: isActive })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/servicios')
  return { success: true }
}

export async function upsertService(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null

  const data = {
    name:             formData.get('name') as string,
    description:      formData.get('description') as string || null,
    category:         formData.get('category') as string,
    duration_minutes: Number(formData.get('duration_minutes')),
    price:            Number(formData.get('price')),
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
  const supabase = await createClient()
  const file = formData.get('file') as File
  if (!file || file.size === 0) return { error: 'No se recibió archivo' }
  if (file.size > 2 * 1024 * 1024) return { error: 'El archivo supera 2 MB' }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
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
  const supabase = await createClient()

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
