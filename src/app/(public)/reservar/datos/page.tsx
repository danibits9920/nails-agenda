import { createClient } from '@/lib/supabase/server'
import StepperHeader from '@/components/ui/StepperHeader'
import DatosForm from './DatosForm'
import { notFound } from 'next/navigation'
import { formatCLP, formatDate, formatTime } from '@/lib/utils'
import { Clock, CalendarDays } from 'lucide-react'

export default async function DatosPage({ searchParams }: {
  searchParams: Promise<{ service?: string; fecha?: string; start?: string; end?: string }>
}) {
  const { service: serviceId, fecha, start, end } = await searchParams
  if (!serviceId || !fecha || !start || !end) notFound()

  const supabase = await createClient()
  const { data: service } = await supabase
    .from('services')
    .select('id, name, price, duration_minutes')
    .eq('id', serviceId)
    .single()

  if (!service) notFound()

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <StepperHeader current={3} />
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Resumen de la cita */}
        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-dorado)]/30 p-5 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-3">Tu cita</p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display font-semibold text-[var(--color-navy)] text-lg">{service.name}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-[var(--color-ink-secondary)]">
                  <CalendarDays size={14} /> {formatDate(fecha)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-[var(--color-ink-secondary)]">
                  <Clock size={14} /> {formatTime(start)}
                </span>
              </div>
            </div>
            <p className="font-bold text-xl text-[var(--color-dorado)] shrink-0">{formatCLP(service.price)}</p>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-[var(--color-navy)]">Tus datos</h1>
          <p className="text-sm text-[var(--color-ink-tertiary)] mt-1">Ingresa tu información para confirmar la reserva.</p>
        </div>

        <DatosForm serviceId={serviceId} fecha={fecha} start={start} end={end} />
      </div>
    </div>
  )
}
