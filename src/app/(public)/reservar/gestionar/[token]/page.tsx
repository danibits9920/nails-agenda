import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, Clock, Scissors } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatCLP, formatDate, formatTime } from '@/lib/utils'
import { hoursUntilInBusinessTz } from '@/lib/tz'
import { MIN_HORAS_CANCELAR } from '@/lib/politicas'
import BrandMark from '@/components/ui/BrandMark'
import GestionarAcciones from './GestionarAcciones'

export const metadata = { title: 'Mi cita', robots: { index: false } }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function GestionarPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!UUID.test(token)) notFound()

  const { data: apt } = await createAdminClient()
    .from('appointments')
    .select('date, start_time, end_time, status, clients(name), services(name, price)')
    .eq('manage_token', token)
    .maybeSingle()
  if (!apt) notFound()

  const client  = apt.clients  as { name: string } | null
  const service = apt.services as { name: string; price: number } | null
  const firstName = client?.name?.split(' ')[0]

  const activa    = ['pending', 'confirmed'].includes(apt.status)
  const cancelada = apt.status === 'cancelled'
  const aTiempo   = hoursUntilInBusinessTz(apt.date, apt.start_time) >= MIN_HORAS_CANCELAR

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col">
      <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border-soft)]">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-2.5">
          <BrandMark size={30} />
          <span className="font-display font-bold text-sm text-[var(--color-navy)] tracking-tight">Nails Art Yurany</span>
        </div>
      </nav>

      <main className="page-enter flex-1 flex items-start justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold text-[var(--color-navy)] mb-2 tracking-tight text-center">
            {cancelada ? 'Cita cancelada' : 'Tu cita'}
          </h1>
          <p className="text-sm text-[var(--color-ink-secondary)] text-center mb-8">
            {cancelada
              ? 'Tu hora quedó liberada. Puedes reservar otra cuando quieras.'
              : `Hola${firstName ? ` ${firstName}` : ''}, desde aquí puedes cancelar o cambiar tu hora.`}
          </p>

          <div className={`bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] p-6 mb-6 shadow-[var(--shadow-raised)] space-y-3.5 ${cancelada ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3">
              <Scissors size={16} className="text-[var(--color-primary-dark)] shrink-0" />
              <div>
                <p className={`font-bold text-sm text-[var(--color-navy)] ${cancelada ? 'line-through' : ''}`}>{service?.name ?? '—'}</p>
                {service && <p className="text-xs text-[var(--color-dorado-dark)] font-bold">{formatCLP(service.price)}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays size={16} className="text-[var(--color-primary-dark)] shrink-0" />
              <p className="text-sm font-semibold text-[var(--color-ink-secondary)] capitalize">{formatDate(apt.date)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[var(--color-primary-dark)] shrink-0" />
              <p className="text-sm font-semibold text-[var(--color-ink-secondary)]">
                {formatTime(apt.start_time)} – {formatTime(apt.end_time)}
              </p>
            </div>
          </div>

          {activa && aTiempo && <GestionarAcciones token={token} />}

          {activa && !aTiempo && (
            <p className="text-sm text-center text-[var(--color-ink-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
              Faltan menos de {MIN_HORAS_CANCELAR} horas para tu cita, así que ya no se puede cambiar desde aquí.
              Si tienes un imprevisto, escríbenos directamente.
            </p>
          )}

          {!activa && (
            <Link href="/reservar" className="press block w-full py-3.5 bg-[var(--color-navy)] text-white text-center text-[15px] font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-colors">
              Reservar otra hora
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
