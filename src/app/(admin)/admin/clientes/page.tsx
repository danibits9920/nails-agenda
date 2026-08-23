import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Users } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const A = `/${process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin'}`
  const supabase = await createClient()

  const LIMITE = 80
  let query = supabase
    .from('clients')
    .select('id, name, email, phone, created_at', { count: 'exact' })
    .order('name')
    .limit(LIMITE)

  if (q) query = query.ilike('name', `%${q}%`)

  const { data: clients, count: total } = await query

  return (
    <div className="p-4 md:p-8 space-y-5 md:space-y-6">
      <div>
        <h1 className="font-display text-page text-[var(--color-navy)]">Clientes</h1>
        <p className="text-sm font-semibold text-[var(--color-ink-secondary)] mt-1">
          {total === 0
            ? (q ? 'Ninguna coincidencia' : 'Todavía no hay clientes')
            : total === 1
              ? '1 cliente'
              : `${total} clientes`}
          {(total ?? 0) > LIMITE && ` · se muestran los ${LIMITE} primeros`}
        </p>
      </div>

      {/* Búsqueda: es una landmark de búsqueda con etiqueta y envío explícito.
          Antes era un input suelto sin nombre accesible y sin ninguna pista
          visible de que había que pulsar Enter. */}
      <form role="search" className="flex max-w-md gap-2">
        <div className="flex-1 min-w-0">
          <label htmlFor="buscar-cliente" className="sr-only">Buscar cliente por nombre</label>
          <Input
            id="buscar-cliente"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Buscar por nombre…"
            className="h-11 bg-[var(--color-surface)]"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 h-11 px-5 rounded-full bg-[var(--color-navy)] text-white text-sm font-semibold hover:bg-[var(--color-navy-light)] transition-colors"
        >
          Buscar
        </button>
        {q && (
          <a
            href={A + '/clientes'}
            className="shrink-0 h-11 px-4 inline-flex items-center rounded-full text-sm font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] hover:bg-[var(--color-surface-container-low)] transition-colors"
          >
            Limpiar
          </a>
        )}
      </form>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        {!clients?.length ? (
          <div className="p-12 text-center">
            <Users size={32} className="mx-auto text-[var(--color-ink-muted)] mb-3 opacity-40" />
            <p className="text-sm font-semibold text-[var(--color-ink-secondary)]">
              {q ? `Ningún cliente coincide con "${q}".` : 'Todavía no hay clientes registrados.'}
            </p>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1">
              {q ? 'Prueba con otro nombre o revisa la ortografía.' : 'Aparecerán aquí en cuanto alguien reserve su primera cita.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border-soft)]">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`${A}/clientes/${client.id}`}
                className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 hover:bg-[var(--color-surface-raised)] transition-all group"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-sm font-bold text-[var(--color-navy)]">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Nombre + contacto */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--color-ink)] group-hover:text-[var(--color-primary-dark)] truncate transition-colors">
                    {client.name}
                  </p>
                  <p className="text-xs font-semibold text-[var(--color-ink-secondary)] mt-0.5 truncate">
                    {client.phone ?? client.email ?? 'Sin contacto'}
                  </p>
                </div>

                {/* Fecha — oculta en mobile */}
                <p className="hidden sm:block text-xs font-bold text-[var(--color-ink-secondary)] shrink-0">
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
