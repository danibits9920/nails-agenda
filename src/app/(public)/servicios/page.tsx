import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  manicure: 'Manicure', pedicure: 'Pedicure',
  nail_art: 'Nail Art', gel: 'Gel',
  acrilico: 'Acrílico', otros: 'Otros',
}

export default async function ServiciosPublicosPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, name, description, category, duration_minutes, price')
    .eq('is_active', true)
    .order('category')
    .order('name')

  const grouped = (services ?? []).reduce<Record<string, typeof services>>((acc, s) => {
    if (!s) return acc
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category]!.push(s)
    return acc
  }, {})

  const categories = Object.keys(grouped)

  return (
    <div className="min-h-screen bg-[var(--color-cream)] selection:bg-[var(--color-primary-light)]">
      <nav className="sticky top-0 z-50 bg-[var(--color-cream)]/90 backdrop-blur-xl border-b border-[var(--color-border-soft)]">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy)] hover:text-[var(--color-primary-dark)] transition-colors group"
          >
            <ArrowLeft size={15} strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform" /> Inicio
          </Link>
          <Link
            href="/reservar"
            className="px-5 py-2 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            Reservar cita
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-10">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-1.5">Catálogo</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-navy)] tracking-tight">Nuestros servicios</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-secondary)] font-medium">Selecciona un servicio para agendar tu cita con Yurany.</p>
        </div>

        {/* Filter chips */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[var(--color-navy)] text-white text-xs font-bold rounded-full shrink-0 shadow-sm">
              Todos
            </div>
            {categories.map(cat => (
              <div
                key={cat}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-surface-container-low)] border border-[var(--color-border)] text-[var(--color-ink-secondary)] text-xs font-semibold rounded-full shrink-0 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/15 cursor-pointer transition-all"
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items?.map((svc) => svc && (
                  <Link
                    key={svc.id}
                    href={`/reservar?service=${svc.id}`}
                    className="group flex flex-col bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)] transition-all duration-200"
                  >
                    <h3 className="font-display font-semibold text-base text-[var(--color-navy)] group-hover:text-[var(--color-primary-dark)] transition-colors mb-1.5 leading-snug">
                      {svc.name}
                    </h3>
                    {svc.description && (
                      <p className="text-xs text-[var(--color-ink-secondary)] mb-5 line-clamp-2 leading-relaxed">{svc.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-[var(--color-border-soft)]">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-ink-secondary)] bg-[var(--color-surface-container-low)] px-2.5 py-1 rounded-full border border-[var(--color-border-soft)]">
                        <Clock size={11} className="text-[var(--color-primary-dark)]" /> {svc.duration_minutes} min
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[var(--color-dorado-dark)]">{formatCLP(svc.price)}</span>
                        <span className="text-xs font-semibold text-[var(--color-primary-dark)] group-hover:translate-x-0.5 transition-transform">Reservar →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
