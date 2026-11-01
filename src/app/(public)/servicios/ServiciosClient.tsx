'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { formatCLP } from '@/lib/utils'
import ServiceImageCarousel from './ServiceImageCarousel'

type ServiceItem = {
  id: string
  name: string
  description: string | null
  category: string
  duration_minutes: number
  price: number
  images: { id: string; url: string; display_order: number }[]
}

type CategoryStyle = { pill: string; dot: string }

export default function ServiciosClient({
  serviceData,
  categories,
  categoryLabels,
  categoryStyles,
}: {
  serviceData: ServiceItem[]
  categories: string[]
  categoryLabels: Record<string, string>
  categoryStyles: Record<string, CategoryStyle>
}) {
  const [active, setActive] = useState<string>('all')

  const filtered = active === 'all'
    ? serviceData
    : serviceData.filter(s => s.category === active)

  const grouped = filtered.reduce<Record<string, ServiceItem[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category]!.push(s)
    return acc
  }, {})

  const fallback = { pill: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' }

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">

      {/* ── Chips de categoría ── */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          <button
            onClick={() => setActive('all')}
            className={[
              'flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full shrink-0 transition-all duration-200',
              active === 'all'
                ? 'bg-[var(--color-navy)] text-white shadow-sm'
                : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)]',
            ].join(' ')}
          >
            Todos
          </button>
          {categories.map(cat => {
            const styles = categoryStyles[cat] ?? fallback
            const isActive = active === cat
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={[
                  'flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full shrink-0 transition-all duration-200',
                  isActive
                    ? `${styles.pill} shadow-sm border border-transparent`
                    : 'bg-white border border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)]',
                ].join(' ')}
              >
                <span className={`w-2 h-2 rounded-full ${styles.dot} shrink-0`} />
                {categoryLabels[cat] ?? cat}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Grid de servicios ── */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([category, items]) => {
          const styles = categoryStyles[category] ?? fallback
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
                  {categoryLabels[category] ?? category}
                </h2>
              </div>

              <div className="stagger grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((svc, i) => (
                  <div
                    key={svc.id}
                    style={{ '--i': i } as React.CSSProperties}
                    className="flex flex-col bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-raised)] hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-300"
                  >
                    <ServiceImageCarousel images={svc.images} serviceName={svc.name} />

                    <div className="p-5 flex flex-col flex-1">
                      <span className={`self-start text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-2.5 ${styles.pill}`}>
                        {categoryLabels[svc.category] ?? svc.category}
                      </span>

                      <h3 className="font-display font-bold text-base text-[var(--color-navy)] leading-snug mb-1.5">
                        {svc.name}
                      </h3>

                      {svc.description && (
                        <p className="text-xs text-[var(--color-ink-secondary)] line-clamp-2 leading-relaxed mb-4 flex-1">
                          {svc.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto mb-4 pt-3 border-t border-[var(--color-border-soft)]">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-ink-secondary)]">
                          <Clock size={11} className="text-[var(--color-primary-dark)]" />
                          {svc.duration_minutes} min
                        </span>
                        <span className="text-sm font-bold text-[var(--color-dorado-dark)]">
                          {formatCLP(svc.price)}
                        </span>
                      </div>

                      <Link
                        href={`/reservar?service=${svc.id}`}
                        className="block w-full py-2.5 bg-[var(--color-navy)] text-white text-sm font-bold rounded-full text-center hover:bg-[var(--color-navy-light)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                      >
                        Reservar →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm font-semibold text-[var(--color-navy)]">No hay servicios en esta categoría.</p>
            <button
              onClick={() => setActive('all')}
              className="mt-3 text-sm font-semibold text-[var(--color-primary-dark)] hover:underline"
            >
              Ver todos
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
