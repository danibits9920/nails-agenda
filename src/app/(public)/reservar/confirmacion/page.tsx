import { createClient } from '@/lib/supabase/server'
import { formatCLP, formatDate, formatTime } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, CalendarDays, Clock, Scissors } from 'lucide-react'

export default async function ConfirmacionPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams
  if (!id) notFound()

  const supabase = await createClient()
  const { data: apt } = await supabase
    .from('appointments')
    .select('id, date, start_time, end_time, status, payment_status, notes, clients(name, email, phone), services(name, price)')
    .eq('id', id)
    .single()

  if (!apt) notFound()

  const client  = apt.clients  as { name: string; email: string | null; phone: string | null } | null
  const service = apt.services as { name: string; price: number } | null

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col">
      {/* Nav mínima */}
      <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-lavanda)]" />
            <span className="font-display font-semibold text-sm text-[var(--color-navy)]">Nails Art Yurany</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">

          {/* Icono de éxito */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
          </div>

          <h1 className="font-display text-3xl font-semibold text-[var(--color-navy)] mb-2">
            ¡Cita reservada!
          </h1>
          <p className="text-[var(--color-ink-secondary)] mb-8">
            {client?.name ? `Hola ${client.name.split(' ')[0]}, t` : 'T'}u reserva fue recibida con éxito.
            {client?.email ? ' Recibirás una confirmación por email.' : ''}
          </p>

          {/* Tarjeta resumen */}
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 text-left mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-4">Detalles de tu cita</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Scissors size={16} className="text-[var(--color-primary-dark)] shrink-0" />
                <div>
                  <p className="font-medium text-[var(--color-navy)]">{service?.name ?? '—'}</p>
                  {service && <p className="text-sm text-[var(--color-dorado)] font-semibold">{formatCLP(service.price)}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-[var(--color-primary-dark)] shrink-0" />
                <p className="text-[var(--color-ink)] capitalize">{formatDate(apt.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[var(--color-primary-dark)] shrink-0" />
                <p className="text-[var(--color-ink)]">{formatTime(apt.start_time)} – {formatTime(apt.end_time)}</p>
              </div>
            </div>

            {apt.payment_status === 'pending_verification' && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border-soft)]">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Pago pendiente</p>
                <p className="text-sm text-[var(--color-ink-secondary)]">
                  Tu cita quedará confirmada una vez que verifiquemos tu transferencia.
                </p>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="inline-block px-8 py-3 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
