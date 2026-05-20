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
    <div className="min-h-screen bg-[var(--color-cream)]">
      <StepperHeader current={2} />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-[var(--color-ink-tertiary)] mb-1">{service.name}</p>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-navy)]">¿Cuándo te acomoda?</h1>
          <p className="text-sm text-[var(--color-ink-tertiary)] mt-1">Selecciona el día y luego elige un horario disponible.</p>
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
