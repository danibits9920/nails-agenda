import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import Link from 'next/link'
import { Clock, Star, Sparkles, MapPin, Phone } from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, name, description, category, duration_minutes, price')
    .eq('is_active', true)
    .order('category')
    .limit(6)

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[var(--color-cream)]/90 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-lavanda)]" />
            <span className="font-display font-semibold text-[var(--color-navy)]">Nails Art Yurany</span>
          </div>
          <Link
            href="/reservar"
            className="px-4 py-2 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-colors"
          >
            Reservar cita
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-primary-light)]/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-lavanda)]/25 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-surface)] border border-[var(--color-primary)]/40 rounded-full text-xs font-medium text-[var(--color-primary-dark)] mb-8">
            <Sparkles size={12} /> Uñas que cuentan tu historia
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-[var(--color-navy)] leading-tight mb-6">
            El arte de cuidar<br />
            <span className="text-[var(--color-primary-dark)]">tus uñas</span>
          </h1>
          <p className="text-lg text-[var(--color-ink-secondary)] max-w-xl mx-auto mb-10 leading-relaxed">
            Manicure, pedicure, gel, acrílico y nail art de alta calidad. Agenda tu cita en minutos y disfruta de una experiencia única.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/reservar"
              className="w-full sm:w-auto px-8 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-colors shadow-lg shadow-[var(--color-navy)]/20"
            >
              Reserva tu cita
            </Link>
            <Link
              href="/servicios"
              className="w-full sm:w-auto px-8 py-3.5 bg-[var(--color-surface)] text-[var(--color-navy)] font-semibold rounded-full border border-[var(--color-border)] hover:border-[var(--color-navy)] transition-colors"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-1">Catálogo</p>
            <h2 className="font-display text-3xl font-semibold text-[var(--color-navy)]">Nuestros servicios</h2>
          </div>
          <Link href="/servicios" className="text-sm font-medium text-[var(--color-dorado)] hover:underline hidden sm:block">
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services?.map((svc) => (
            <Link
              key={svc.id}
              href={`/reservar?service=${svc.id}`}
              className="group bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-raised)] transition-all"
            >
              <h3 className="font-display font-semibold text-[var(--color-navy)] mb-1 group-hover:text-[var(--color-primary-dark)] transition-colors">
                {svc.name}
              </h3>
              {svc.description && (
                <p className="text-sm text-[var(--color-ink-tertiary)] mb-4 line-clamp-2">{svc.description}</p>
              )}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--color-border-soft)]">
                <span className="flex items-center gap-1 text-xs text-[var(--color-ink-secondary)]">
                  <Clock size={12} /> {svc.duration_minutes} min
                </span>
                <span className="text-sm font-bold text-[var(--color-dorado)]">{formatCLP(svc.price)}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <Link href="/servicios" className="text-sm font-medium text-[var(--color-dorado)] hover:underline">
            Ver todos los servicios →
          </Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-border)] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-1">Proceso</p>
            <h2 className="font-display text-3xl font-semibold text-[var(--color-navy)]">¿Cómo agendar?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Elige tu servicio', desc: 'Explora el catálogo y selecciona el servicio que prefieres.' },
              { n: '02', title: 'Selecciona fecha', desc: 'Elige el día y horario disponible que mejor te acomode.' },
              { n: '03', title: 'Tus datos', desc: 'Ingresa tu nombre y contacto para confirmar la reserva.' },
              { n: '04', title: 'Confirma y listo', desc: 'Paga online o presencial. Recibirás confirmación por email.' },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-3">
                  <span className="text-xs font-bold text-[var(--color-dorado)]">{step.n}</span>
                </div>
                <h3 className="font-semibold text-[var(--color-navy)] mb-1">{step.title}</h3>
                <p className="text-sm text-[var(--color-ink-tertiary)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-[var(--color-primary-light)]/40 to-[var(--color-lavanda)]/30 rounded-[var(--radius-xl)] p-12 border border-[var(--color-primary)]/20">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-navy)] mb-3">
            ¿Lista para tu próxima cita?
          </h2>
          <p className="text-[var(--color-ink-secondary)] mb-8">Agenda online en menos de 2 minutos.</p>
          <Link
            href="/reservar"
            className="inline-block px-10 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] transition-colors shadow-lg shadow-[var(--color-navy)]/20"
          >
            Reservar ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-lavanda)]" />
            <span className="font-display font-semibold text-sm text-[var(--color-navy)]">Nails Art Yurany</span>
          </div>
          <p className="text-xs text-[var(--color-ink-muted)]">© {new Date().getFullYear()} · Chile</p>
        </div>
      </footer>

    </div>
  )
}
