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
  const firstName = client?.name?.split(' ')[0] ?? null

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col selection:bg-[var(--color-primary-light)]">
      {/* Nav mínima */}
      <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border-soft)]">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] shadow-sm" />
            <span className="font-display font-bold text-sm text-[var(--color-navy)] tracking-tight">Nails Art Yurany</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-start justify-center px-5 py-12">
        <div className="w-full max-w-md">

          {/* Ícono de éxito */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 scale-125 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center shadow-sm">
                <CheckCircle size={40} className="text-emerald-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-[var(--color-navy)] mb-2 tracking-tight">
              ¡Cita reservada!
            </h1>
            <p className="text-sm text-[var(--color-ink-secondary)] font-medium leading-relaxed">
              {firstName ? `Hola ${firstName}, t` : 'T'}u reserva fue recibida con éxito.
              {client?.email ? ' Recibirás una confirmación por email.' : ''}
            </p>
          </div>

          {/* Tarjeta resumen */}
          <div className="bg-gradient-to-br from-[var(--color-primary-light)]/20 via-white to-[var(--color-lavanda)]/15 rounded-3xl border border-[var(--color-primary)]/20 p-6 mb-6 shadow-[var(--shadow-raised)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-4">Detalles de tu cita</p>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)]/30 flex items-center justify-center shrink-0">
                  <Scissors size={14} className="text-[var(--color-primary-dark)]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[var(--color-navy)]">{service?.name ?? '—'}</p>
                  {service && (
                    <p className="text-xs text-[var(--color-dorado-dark)] font-bold mt-0.5">{formatCLP(service.price)}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)]/30 flex items-center justify-center shrink-0">
                  <CalendarDays size={14} className="text-[var(--color-primary-dark)]" />
                </div>
                <p className="text-sm font-semibold text-[var(--color-ink-secondary)] capitalize">{formatDate(apt.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)]/30 flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-[var(--color-primary-dark)]" />
                </div>
                <p className="text-sm font-semibold text-[var(--color-ink-secondary)]">
                  {formatTime(apt.start_time)} – {formatTime(apt.end_time)}
                </p>
              </div>
            </div>

            {apt.payment_status === 'pending_verification' && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border-soft)]">
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-[0.12em] mb-1">Pago pendiente</p>
                  <p className="text-xs text-amber-700/80 leading-relaxed">
                    Tu cita quedará confirmada una vez que verifiquemos tu transferencia. Recibirás un mensaje con las instrucciones.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="block w-full py-3.5 bg-[var(--color-navy)] text-white text-center text-[15px] font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
          >
            Volver al inicio
          </Link>

          <p className="text-center text-xs text-[var(--color-ink-muted)] mt-4 font-medium">
            © {new Date().getFullYear()} Nails Art Yurany · Hecho con amor
          </p>
        </div>
      </div>
    </div>
  )
}
