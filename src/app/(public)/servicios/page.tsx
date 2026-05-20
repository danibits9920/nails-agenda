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

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <nav className="sticky top-0 z-50 bg-[var(--color-cream)]/90 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] transition-colors">
            <ArrowLeft size={16} /> Inicio
          </Link>
          <Link href="/reservar" className="px-4 py-2 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-colors">
            Reservar cita
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-semibold text-[var(--color-navy)]">Nuestros servicios</h1>
          <p className="mt-2 text-[var(--color-ink-secondary)]">Haz clic en cualquier servicio para agendar tu cita.</p>
        </div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-4">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items?.map((svc) => svc && (
                  <Link
                    key={svc.id}
                    href={`/reservar?service=${svc.id}`}
                    className="group bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-raised)] transition-all"
                  >
                    <h3 className="font-display font-semibold text-[var(--color-navy)] group-hover:text-[var(--color-primary-dark)] transition-colors mb-1">
                      {svc.name}
                    </h3>
                    {svc.description && (
                      <p className="text-sm text-[var(--color-ink-tertiary)] mb-4 line-clamp-2">{svc.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-soft)]">
                      <span className="flex items-center gap-1.5 text-xs text-[var(--color-ink-secondary)]">
                        <Clock size={12} /> {svc.duration_minutes} min
                      </span>
                      <span className="text-sm font-bold text-[var(--color-dorado)]">{formatCLP(svc.price)}</span>
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
