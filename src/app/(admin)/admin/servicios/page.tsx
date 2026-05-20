import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import { Clock, ToggleLeft, ToggleRight } from 'lucide-react'
import ToggleActive from './ToggleActive'

const CATEGORY_LABELS: Record<string, string> = {
  manicure: 'Manicure', pedicure: 'Pedicure',
  nail_art: 'Nail Art', gel: 'Gel',
  acrilico: 'Acrílico', otros: 'Otros',
}

export default async function ServiciosPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('category')
    .order('name')

  const grouped = (services ?? []).reduce<Record<string, typeof services>>((acc, s) => {
    if (!s) return acc
    const cat = s.category
    if (!acc[cat]) acc[cat] = []
    acc[cat]!.push(s)
    return acc
  }, {})

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-display text-4.5xl font-bold text-[var(--color-navy)] tracking-tight">Servicios</h1>
        <p className="text-sm font-semibold text-[var(--color-ink-secondary)] mt-1">Catálogo de servicios de belleza</p>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] px-1">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items?.map((svc) => svc && (
                <div
                  key={svc.id}
                  className={`bg-[var(--color-surface)] rounded-[var(--radius-xl)] border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm ${
                    svc.is_active
                      ? 'border-[var(--color-border)]'
                      : 'border-[var(--color-border-soft)] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-[var(--color-navy)] leading-snug">{svc.name}</h3>
                    <ToggleActive id={svc.id} isActive={svc.is_active} />
                  </div>
                  {svc.description && (
                    <p className="text-xs font-semibold text-[var(--color-ink-secondary)] mb-4 line-clamp-2 leading-relaxed">{svc.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-soft)]">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink-secondary)]">
                      <Clock size={13} className="text-[var(--color-primary-dark)]" /> {svc.duration_minutes} min
                    </span>
                    <span className="text-sm font-bold text-[var(--color-dorado-dark)]">{formatCLP(svc.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
