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
