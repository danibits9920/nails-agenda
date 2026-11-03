'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: 'Email o contraseña incorrectos.' }

  const adminBase = `/${process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin'}`
  revalidatePath(adminBase, 'layout')

  // Sólo se acepta volver a una ruta del propio panel: nunca a otro sitio.
  const next = (formData.get('next') as string | null) ?? ''
  const safe = next.startsWith(adminBase + '/') && !next.startsWith('//') && !next.includes('\\')
  redirect(safe ? next : `${adminBase}/dashboard`)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
