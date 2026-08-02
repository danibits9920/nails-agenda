import { createClient } from '@/lib/supabase/server'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type AdminGate =
  | { ok: true; supabase: SupabaseClient<Database>; user: User }
  | { ok: false; error: string }

/**
 * Guard de defensa en profundidad para server actions de administración.
 *
 * El middleware protege las RUTAS admin, pero las server actions son
 * endpoints POST que se pueden invocar directamente sin pasar por esa
 * protección. Por eso cada action que muta datos sensibles debe validar
 * la sesión aquí, además de las políticas RLS de Supabase.
 *
 * En esta app no hay registro público: la única cuenta con sesión es la
 * de la administradora, así que "sesión válida" equivale a "admin".
 *
 * Uso:
 *   const gate = await requireAdmin()
 *   if (!gate.ok) return { error: gate.error }
 *   const { supabase } = gate
 */
export async function requireAdmin(): Promise<AdminGate> {
  const supabase = await createClient()
  // getUser() valida el JWT contra el servidor de Supabase Auth
  // (a diferencia de getSession(), que solo lee la cookie).
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return { ok: false, error: 'No autorizado. Inicia sesión como administradora.' }
  }
  return { ok: true, supabase, user }
}
