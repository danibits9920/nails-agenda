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
    <div className="min-h-screen bg-[var(--color-cream)]">
      <StepperHeader current={1} />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-navy)]">¿Qué servicio deseas?</h1>
          <p className="text-sm text-[var(--color-ink-tertiary)] mt-1">Selecciona el servicio para tu cita.</p>
        </div>

        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-2">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="space-y-2">
                {items?.map((svc) => {
                  if (!svc) return null
                  const isSelected = selectedId === svc.id
                  return (
                    <Link
                      key={svc.id}
                      href={`/reservar?service=${svc.id}`}
                      className={`flex items-center gap-4 p-4 rounded-[var(--radius-xl)] border transition-all ${
                        isSelected
                          ? 'border-[var(--color-dorado)] bg-[var(--color-surface)] shadow-[var(--shadow-raised)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-[var(--color-dorado)] bg-[var(--color-dorado)]' : 'border-[var(--color-border-strong)]'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--color-navy)]">{svc.name}</p>
                        {svc.description && (
                          <p className="text-xs text-[var(--color-ink-tertiary)] mt-0.5 line-clamp-1">{svc.description}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[var(--color-dorado)]">{formatCLP(svc.price)}</p>
                        <p className="text-xs text-[var(--color-ink-muted)] flex items-center gap-1 justify-end mt-0.5">
                          <Clock size={11} /> {svc.duration_minutes} min
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          {selectedId ? (
            <Link
              href={`/reservar/horario?service=${selectedId}`}
              className="block w-full py-3.5 bg-[var(--color-navy)] text-white text-center font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-colors"
            >
              Continuar →
            </Link>
          ) : (
            <button disabled className="block w-full py-3.5 bg-[var(--color-ink-muted)] text-white text-center font-semibold rounded-full opacity-50 cursor-not-allowed">
              Selecciona un servicio para continuar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
