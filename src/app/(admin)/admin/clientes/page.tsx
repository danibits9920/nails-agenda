import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Users } from 'lucide-react'
import Link from 'next/link'

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('clients')
    .select('id, name, email, phone, created_at')
    .order('name')
    .limit(80)

  if (q) query = query.ilike('name', `%${q}%`)

  const { data: clients } = await query

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4.5xl font-bold text-[var(--color-navy)] tracking-tight">Clientes</h1>
          <p className="text-sm font-semibold text-[var(--color-ink-secondary)] mt-1">{clients?.length ?? 0} registros encontrados</p>
        </div>
      </div>

      {/* Búsqueda */}
      <form className="max-w-sm">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre…"
          className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all shadow-sm"
        />
      </form>

      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden shadow-sm">
        {!clients?.length ? (
          <div className="p-12 text-center">
            <Users size={32} className="mx-auto text-[var(--color-ink-muted)] mb-3 opacity-40" />
            <p className="text-sm font-medium text-[var(--color-ink-muted)]">No se encontraron clientes.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border-soft)]">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/admin/clientes/${client.id}`}
                className="flex items-center gap-4 px-6 py-4.5 hover:bg-[var(--color-surface-raised)] transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-sm font-bold text-[var(--color-navy)]">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--color-ink)] group-hover:text-[var(--color-primary-dark)] truncate transition-colors">
                    {client.name}
                  </p>
                  <p className="text-xs font-semibold text-[var(--color-ink-secondary)] mt-0.5 truncate">
                    {client.phone ?? client.email ?? 'Sin contacto'}
                  </p>
                </div>
                <p className="text-xs font-bold text-[var(--color-ink-secondary)] shrink-0">
                  Desde {formatDate(client.created_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
