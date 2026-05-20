import { createClient } from '@/lib/supabase/server'
import StepperHeader from '@/components/ui/StepperHeader'
import HorarioSelector from './HorarioSelector'
import { notFound } from 'next/navigation'

export default async function HorarioPage({ searchParams }: { searchParams: Promise<{ service?: string; fecha?: string }> }) {
  const { service: serviceId, fecha } = await searchParams

  if (!serviceId) notFound()

  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select('id, name, duration_minutes, price')
    .eq('id', serviceId)
    .single()

  if (!service) notFound()

  // Si hay fecha, traer los slots disponibles
  let slots: { slot_start: string; slot_end: string }[] = []
  if (fecha) {
    const { data } = await supabase.rpc('get_available_slots', {
      p_date: fecha,
      p_duration_mins: service.duration_minutes,
    })
    slots = data ?? []
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] selection:bg-[var(--color-primary-light)]">
      <StepperHeader current={2} />
      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-[var(--color-surface-container-low)] border border-[var(--color-border)] rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary-dark)] mb-3">
            Paso 2 de 4
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight mb-3">¿Cuándo te acomoda?</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary-light)]/15 border border-[var(--color-primary)]/30 rounded-full text-xs font-semibold text-[var(--color-primary-dark)] mb-3">
            {service.name}
          </div>
          <p className="text-sm text-[var(--color-ink-secondary)] font-medium">Selecciona el día y luego elige tu hora.</p>
        </div>

        <HorarioSelector
          serviceId={serviceId}
          serviceDuration={service.duration_minutes}
          selectedFecha={fecha}
          slots={slots}
        />
      </div>
    </div>
  )
}
