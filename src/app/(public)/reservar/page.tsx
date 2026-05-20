import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import StepperHeader from '@/components/ui/StepperHeader'
import Link from 'next/link'
import { Clock } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  manicure: 'Manicure', pedicure: 'Pedicure',
  nail_art: 'Nail Art', gel: 'Gel',
  acrilico: 'Acrílico', otros: 'Otros',
}

export default async function ReservarPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service: selectedId } = await searchParams
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
    <div className="min-h-screen bg-[var(--color-cream)] selection:bg-[var(--color-primary-light)]">
      <StepperHeader current={1} />

      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-[var(--color-surface-container-low)] border border-[var(--color-border)] rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary-dark)] mb-3">
            Paso 1 de 4
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">¿Qué servicio deseas?</h1>
          <p className="text-sm text-[var(--color-ink-secondary)] mt-1 font-medium">Selecciona el servicio para tu cita de belleza.</p>
        </div>

        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
              </div>
              <div className="space-y-2.5">
                {items?.map((svc) => {
                  if (!svc) return null
                  const isSelected = selectedId === svc.id
                  return (
                    <Link
                      key={svc.id}
                      href={`/reservar?service=${svc.id}`}
                      className={[
                        'flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200',
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/15 shadow-[var(--shadow-card)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/60 hover:bg-[var(--color-surface-container-low)] hover:shadow-[var(--shadow-card)]',
                      ].join(' ')}
                    >
                      {/* Radio */}
                      <div className={[
                        'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200',
                        isSelected
                          ? 'border-[var(--color-primary-dark)] bg-[var(--color-primary-dark)]'
                          : 'border-[var(--color-border-strong)] bg-white',
                      ].join(' ')}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={['font-semibold text-sm leading-snug', isSelected ? 'text-[var(--color-navy)]' : 'text-[var(--color-navy)]'].join(' ')}>
                          {svc.name}
                        </p>
                        {svc.description && (
                          <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5 line-clamp-1 leading-relaxed">{svc.description}</p>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--color-ink-secondary)] mt-1.5">
                          <Clock size={10} className="text-[var(--color-primary-dark)]" /> {svc.duration_minutes} min
                        </span>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[var(--color-dorado-dark)]">{formatCLP(svc.price)}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 sticky bottom-0 pt-4 pb-6 bg-gradient-to-t from-[var(--color-cream)] via-[var(--color-cream)]/95 to-transparent -mx-5 px-5">
          {selectedId ? (
            <Link
              href={`/reservar/horario?service=${selectedId}`}
              className="flex items-center justify-center w-full py-3.5 bg-[var(--color-navy)] text-white text-[15px] font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md hover:shadow-lg"
            >
              Continuar →
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-3.5 bg-[var(--color-ink-muted)]/40 text-[var(--color-ink-tertiary)] text-[15px] text-center font-semibold rounded-full cursor-not-allowed"
            >
              Selecciona un servicio para continuar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
