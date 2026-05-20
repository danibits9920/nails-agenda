import { createClient } from '@/lib/supabase/server'
import StepperHeader from '@/components/ui/StepperHeader'
import ServiceSelector from './ServiceSelector'

export default async function ReservarPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service: selectedId } = await searchParams
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select('id, name, description, category, duration_minutes, price')
    .eq('is_active', true)
    .order('category')
    .order('name')

  return (
    <div className="min-h-screen bg-[var(--color-cream)] selection:bg-[var(--color-primary-light)]">
      <StepperHeader current={1} />

      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-[var(--color-surface-container-low)] border border-[var(--color-border)] rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary-dark)] mb-3">
            Paso 1 de 4
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">
            ¿Qué servicio deseas?
          </h1>
          <p className="text-sm text-[var(--color-ink-secondary)] mt-1 font-medium">
            Selecciona el servicio para tu cita de belleza.
          </p>
        </div>

        <ServiceSelector services={services ?? []} initialSelectedId={selectedId} />
      </div>
    </div>
  )
}
