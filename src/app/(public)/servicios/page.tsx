import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import Link from 'next/link'
import { Clock, ArrowLeft, Sparkles } from 'lucide-react'
import ServiceImageCarousel from './ServiceImageCarousel'
import ServiciosClient from './ServiciosClient'

const CATEGORY_STYLES: Record<string, { pill: string; dot: string }> = {
  manicure: { pill: 'bg-[var(--color-primary-light)]/40 text-[var(--color-primary-dark)]',  dot: 'bg-[var(--color-primary)]'      },
  pedicure: { pill: 'bg-[var(--color-lavanda)]/30 text-purple-700',                          dot: 'bg-[var(--color-lavanda-dark)]' },
  nail_art: { pill: 'bg-pink-100 text-pink-700',                                              dot: 'bg-pink-400'                    },
  gel:      { pill: 'bg-amber-100 text-amber-700',                                            dot: 'bg-amber-400'                   },
  acrilico: { pill: 'bg-blue-100 text-blue-600',                                              dot: 'bg-blue-400'                    },
  otros:    { pill: 'bg-[var(--color-cream)] text-[var(--color-ink-secondary)]',              dot: 'bg-[var(--color-ink-muted)]'    },
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

  /* Serializable para el client component */
  const serviceData = (services ?? []).map(s => ({
    ...s!,
    images: imagesByService[s!.id] ?? [],
  }))

  return (
    <div className="min-h-screen bg-[var(--color-cream)] selection:bg-[var(--color-primary-light)]">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-[var(--color-cream)]/90 backdrop-blur-xl border-b border-[var(--color-border-soft)]">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy)] hover:text-[var(--color-primary-dark)] transition-colors group"
          >
            <ArrowLeft size={15} strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform" />
            Inicio
          </Link>
          <Link
            href="/reservar"
            className="px-5 py-2 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            Reservar cita
          </Link>
        </div>
      </nav>

      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-light)]/20 via-[var(--color-cream)] to-[var(--color-lavanda)]/15 border-b border-[var(--color-border-soft)]">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--color-primary)]/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-5 py-10 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] flex items-center justify-center shadow-sm">
              <Sparkles size={11} className="text-white" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">Catálogo completo</p>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-navy)] tracking-tight mb-2">
            Nuestros servicios
          </h1>
          <p className="text-sm text-[var(--color-ink-secondary)] font-medium">
            Selecciona un servicio y agenda tu cita con Yurany en minutos.
          </p>
        </div>
      </div>

      {/* ── Contenido con filtros ── */}
      <ServiciosClient
        serviceData={serviceData}
        categories={categories}
        categoryLabels={CATEGORY_LABELS}
        categoryStyles={CATEGORY_STYLES}
      />
    </div>
  )
}
