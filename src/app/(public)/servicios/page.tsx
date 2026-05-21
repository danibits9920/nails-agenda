import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import Link from 'next/link'
import { Clock, ArrowLeft } from 'lucide-react'
import ServiceImageCarousel from './ServiceImageCarousel'

const CATEGORY_COLORS: Record<string, string> = {
  manicure: 'bg-[var(--color-primary-light)]/40 text-[var(--color-primary-dark)]',
  pedicure: 'bg-[var(--color-lavanda)]/30 text-purple-700',
  nail_art: 'bg-pink-100 text-pink-700',
  gel:      'bg-amber-100 text-amber-700',
  acrilico: 'bg-blue-100 text-blue-700',
  otros:    'bg-[var(--color-surface-container-low)] text-[var(--color-ink-secondary)]',
}

export default async function ServiciosPublicosPage() {
  const supabase = await createClient()

  const [{ data: services }, { data: rawCategories }] = await Promise.all([
    supabase.from('services')
      .select('id, name, description, category, duration_minutes, price')
      .eq('is_active', true)
      .order('category')
      .order('name'),
    supabase.from('service_categories')
      .select('slug, label')
      .order('display_order'),
  ])

  const CATEGORY_LABELS = (rawCategories ?? []).reduce<Record<string, string>>((acc, c) => {
    acc[c.slug] = c.label; return acc
  }, {})

  const serviceIds = services?.map(s => s.id) ?? []

  const { data: allImages } = serviceIds.length
    ? await supabase
        .from('service_images')
        .select('id, service_id, url, display_order')
        .in('service_id', serviceIds)
        .order('display_order')
    : { data: [] as { id: string; service_id: string; url: string; display_order: number }[] }

  const imagesByService = (allImages ?? []).reduce<Record<string, { id: string; url: string; display_order: number }[]>>((acc, img) => {
    if (!img) return acc
    if (!acc[img.service_id]) acc[img.service_id] = []
    acc[img.service_id]!.push({ id: img.id, url: img.url, display_order: img.display_order })
    return acc
  }, {})

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
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-navy)] text-white text-xs font-bold rounded-full shrink-0 shadow-sm">
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
                {items?.map((svc) => {
                  if (!svc) return null
                  const images = imagesByService[svc.id] ?? []
                  return (
                    <div
                      key={svc.id}
                      className="flex flex-col bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-raised)] transition-all duration-200"
                    >
                      <ServiceImageCarousel images={images} serviceName={svc.name} />

                      <div className="p-5 flex flex-col flex-1">
                        <span className={[
                          'self-start text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-2.5',
                          CATEGORY_COLORS[svc.category] ?? CATEGORY_COLORS.otros,
                        ].join(' ')}>
                          {CATEGORY_LABELS[svc.category] ?? svc.category}
                        </span>

                        <h3 className="font-display font-bold text-base text-[var(--color-navy)] leading-snug mb-1.5">
                          {svc.name}
                        </h3>

                        {svc.description && (
                          <p className="text-xs text-[var(--color-ink-secondary)] line-clamp-2 leading-relaxed mb-4">
                            {svc.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto mb-4 pt-3 border-t border-[var(--color-border-soft)]">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-ink-secondary)]">
                            <Clock size={11} className="text-[var(--color-primary-dark)]" /> {svc.duration_minutes} min
                          </span>
                          <span className="text-sm font-bold text-[var(--color-dorado-dark)]">{formatCLP(svc.price)}</span>
                        </div>

                        <Link
                          href={`/reservar?service=${svc.id}`}
                          className="block w-full py-2.5 bg-[var(--color-navy)] text-white text-sm font-bold rounded-full text-center hover:bg-[var(--color-navy-light)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                        >
                          Reservar →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
