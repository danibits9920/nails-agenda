'use server'
import { requireAdmin } from '@/lib/auth-guard'
import { revalidatePath } from 'next/cache'

function toSlug(label: string) {
  return label.trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

export async function createCategory(formData: FormData) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  const label = (formData.get('label') as string ?? '').trim()
  if (!label) return { error: 'El nombre es requerido' }

  const slug = toSlug(label)
  const { error } = await supabase
    .from('service_categories')
    .insert({ slug, label })

  if (error) return { error: error.message }
  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')
  revalidatePath('/reservar')
  return { success: true }
}

export async function updateCategory(formData: FormData) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  const id    = formData.get('id') as string
  const label = (formData.get('label') as string ?? '').trim()
  if (!label) return { error: 'El nombre es requerido' }

  const { error } = await supabase
    .from('service_categories')
    .update({ label })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')
  revalidatePath('/reservar')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const gate = await requireAdmin()
  if (!gate.ok) return { error: gate.error }
  const { supabase } = gate
  const { error } = await supabase
    .from('service_categories')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')
  revalidatePath('/reservar')
  return { success: true }
}
