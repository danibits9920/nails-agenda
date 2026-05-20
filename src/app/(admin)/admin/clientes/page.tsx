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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-navy)]">Clientes</h1>
          <p className="text-sm text-[var(--color-ink-tertiary)] mt-0.5">{clients?.length ?? 0} registros</p>
        </div>
      </div>

      {/* Búsqueda */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre…"
          className="w-full max-w-sm px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-dorado)] focus:ring-2 focus:ring-[var(--color-dorado)]/20 transition-colors"
        />
      </form>

      <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden">
        {!clients?.length ? (
          <div className="p-12 text-center">
            <Users size={32} className="mx-auto text-[var(--color-ink-muted)] mb-3 opacity-40" />
            <p className="text-sm text-[var(--color-ink-muted)]">No se encontraron clientes.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border-soft)]">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/admin/clientes/${client.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--color-surface-raised)] transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-lavanda)] flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-[var(--color-navy)]">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-ink)] group-hover:text-[var(--color-navy)] truncate transition-colors">
                    {client.name}
                  </p>
                  <p className="text-sm text-[var(--color-ink-tertiary)] truncate">
                    {client.phone ?? client.email ?? 'Sin contacto'}
                  </p>
                </div>
                <p className="text-xs text-[var(--color-ink-muted)] shrink-0">
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
