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
    <div className="min-h-screen bg-[var(--color-cream)] selection:bg-[var(--color-primary-light)]">
      <StepperHeader current={3} />

      <div className="max-w-2xl mx-auto px-5 py-8">
        {/* Resumen */}
        <div className="bg-gradient-to-r from-[var(--color-primary-light)]/20 to-[var(--color-lavanda)]/10 rounded-2xl border border-[var(--color-primary)]/20 p-5 mb-8 shadow-[var(--shadow-card)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-3">Tu cita</p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display font-bold text-[var(--color-navy)] text-base tracking-tight">{service.name}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-secondary)]">
                  <CalendarDays size={12} className="text-[var(--color-primary-dark)]" /> {formatDate(fecha)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink-secondary)]">
                  <Clock size={12} className="text-[var(--color-primary-dark)]" /> {formatTime(start)}
                </span>
              </div>
            </div>
            <p className="font-bold text-lg text-[var(--color-dorado-dark)] shrink-0">{formatCLP(service.price)}</p>
          </div>
        </div>

        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-[var(--color-surface-container-low)] border border-[var(--color-border)] rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary-dark)] mb-3">
            Paso 3 de 4
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">Tus datos</h1>
          <p className="text-sm text-[var(--color-ink-secondary)] mt-1 font-medium">Ingresa tu información para confirmar la reserva.</p>
        </div>

        <DatosForm serviceId={serviceId} fecha={fecha} start={start} end={end} />
      </div>
    </div>
  )
}
