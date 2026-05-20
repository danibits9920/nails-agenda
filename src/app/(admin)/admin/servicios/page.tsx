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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-navy)]">Servicios</h1>
          <p className="text-sm text-[var(--color-ink-tertiary)] mt-0.5">Catálogo de servicios</p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-3 px-1">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {items?.map((svc) => svc && (
                <div
                  key={svc.id}
                  className={`bg-[var(--color-surface)] rounded-[var(--radius-xl)] border p-5 transition-opacity ${svc.is_active ? 'border-[var(--color-border)]' : 'border-[var(--color-border-soft)] opacity-50'}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-medium text-[var(--color-navy)] leading-snug">{svc.name}</h3>
                    <ToggleActive id={svc.id} isActive={svc.is_active} />
                  </div>
                  {svc.description && (
                    <p className="text-xs text-[var(--color-ink-tertiary)] mb-3 line-clamp-2">{svc.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-[var(--color-ink-secondary)]">
                      <Clock size={12} /> {svc.duration_minutes} min
                    </span>
                    <span className="text-sm font-semibold text-[var(--color-dorado)]">{formatCLP(svc.price)}</span>
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
