import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import Link from 'next/link'
import { Clock, Sparkles, Star, MapPin } from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, name, description, category, duration_minutes, price')
    .eq('is_active', true)
    .order('category')
    .limit(6)

  return (
    <div className="min-h-screen bg-[var(--color-cream)] selection:bg-[var(--color-primary-light)]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[var(--color-cream)]/90 backdrop-blur-xl border-b border-[var(--color-border-soft)]">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] shadow-sm" />
            <span className="font-display font-bold text-base text-[var(--color-navy)] tracking-tight">Nails Art Yurany</span>
          </div>
          <Link
            href="/reservar"
            className="px-5 py-2 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            Reservar cita
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)]/25 via-[var(--color-cream)] to-[var(--color-lavanda)]/20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--color-primary-light)]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[var(--color-lavanda)]/25 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-[var(--color-primary)]/30 rounded-full text-xs font-semibold text-[var(--color-primary-dark)] mb-8 shadow-sm">
            <Sparkles size={12} className="text-[var(--color-dorado)]" />
            Uñas que cuentan tu historia
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--color-navy)] leading-[1.1] mb-5 tracking-tight">
            El arte de cuidar<br />
            <span className="bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-lavanda-dark)] bg-clip-text text-transparent">
              tus uñas
            </span>
          </h1>
          <p className="text-[15px] md:text-lg text-[var(--color-ink-secondary)] max-w-lg mx-auto mb-10 leading-relaxed font-medium">
            Manicure, pedicure, gel, acrílico y nail art de alta calidad.<br className="hidden sm:block" /> Agenda tu cita en minutos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs mx-auto sm:max-w-none">
            <Link
              href="/reservar"
              className="w-full sm:w-auto px-8 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md hover:shadow-lg text-center text-[15px]"
            >
              Reserva tu cita →
            </Link>
            <Link
              href="/servicios"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/70 backdrop-blur-sm text-[var(--color-navy)] font-semibold rounded-full border border-[var(--color-border-strong)] hover:border-[var(--color-navy)] hover:bg-white hover:-translate-y-0.5 transition-all shadow-sm text-center text-[15px]"
            >
              Ver servicios
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-10">
            {[
              { icon: <Star size={12} className="fill-[var(--color-dorado)] text-[var(--color-dorado)]" />, text: '5.0 valoración' },
              { icon: '💅', text: '+200 clientas' },
              { icon: <MapPin size={12} className="text-[var(--color-primary-dark)]" />, text: 'Santiago, Chile' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/80 backdrop-blur-sm border border-[var(--color-border)] rounded-full text-xs font-semibold text-[var(--color-ink-secondary)] shadow-sm">
                {typeof item.icon === 'string' ? <span className="text-xs">{item.icon}</span> : item.icon}
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-1.5">Catálogo</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">Nuestros servicios</h2>
          </div>
          <Link href="/servicios" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-navy)] transition-colors group">
            Ver todos <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services?.map((svc) => (
            <Link
              key={svc.id}
              href={`/reservar?service=${svc.id}`}
              className="group flex flex-col bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)] transition-all duration-200"
            >
              <h3 className="font-display font-semibold text-base text-[var(--color-navy)] mb-2 group-hover:text-[var(--color-primary-dark)] transition-colors leading-snug">
                {svc.name}
              </h3>
              {svc.description && (
                <p className="text-xs text-[var(--color-ink-secondary)] mb-5 line-clamp-2 leading-relaxed">{svc.description}</p>
              )}
              <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-[var(--color-border-soft)]">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-ink-secondary)] bg-[var(--color-surface-container-low)] px-2.5 py-1 rounded-full border border-[var(--color-border-soft)]">
                  <Clock size={11} className="text-[var(--color-primary-dark)]" /> {svc.duration_minutes} min
                </span>
                <span className="text-sm font-bold text-[var(--color-dorado-dark)]">{formatCLP(svc.price)}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <Link href="/servicios" className="text-sm font-semibold text-[var(--color-primary-dark)] hover:underline">
            Ver todos los servicios →
          </Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-[var(--color-surface-container-low)] border-y border-[var(--color-border-soft)] py-16">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-1.5">Proceso fácil</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">¿Cómo agendar?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[
              { n: '01', title: 'Elige tu servicio', desc: 'Explora el catálogo y selecciona el servicio que prefieres.' },
              { n: '02', title: 'Selecciona fecha', desc: 'Elige el día y horario disponible que mejor te acomode.' },
              { n: '03', title: 'Tus datos', desc: 'Ingresa tu nombre y contacto para confirmar la reserva.' },
              { n: '04', title: 'Confirma y listo', desc: 'Paga online o presencial. Recibe confirmación por email.' },
            ].map((step, i) => (
              <div key={step.n} className="text-center group relative">
                {i < 3 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-px bg-[var(--color-border)] z-0" />
                )}
                <div className="relative z-10 w-11 h-11 rounded-full bg-white border-2 border-[var(--color-primary)]/30 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary-light)]/20 transition-all duration-200">
                  <span className="text-xs font-bold text-[var(--color-primary-dark)]">{step.n}</span>
                </div>
                <h3 className="font-semibold text-[var(--color-navy)] text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-[var(--color-ink-secondary)] leading-relaxed px-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 py-16 text-center">
        <div className="bg-gradient-to-br from-[var(--color-primary-light)]/25 via-white/80 to-[var(--color-lavanda)]/20 rounded-3xl p-10 md:p-14 border border-[var(--color-primary)]/20 shadow-[var(--shadow-card)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-lavanda)]/5 pointer-events-none" />
          <h2 className="font-display text-2xl md:text-4xl font-bold text-[var(--color-navy)] mb-3 tracking-tight relative z-10">
            ¿Lista para consentir tus manos?
          </h2>
          <p className="text-sm md:text-base text-[var(--color-ink-secondary)] mb-8 max-w-sm mx-auto font-medium relative z-10 leading-relaxed">
            Agenda tu hora en línea en menos de 2 minutos y asegura tu espacio con Yurany.
          </p>
          <Link
            href="/reservar"
            className="relative z-10 inline-block px-10 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Reservar ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-soft)] bg-[var(--color-surface)] py-8">
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)]" />
            <span className="font-display font-bold text-sm text-[var(--color-navy)]">Nails Art Yurany</span>
          </div>
          <p className="text-xs text-[var(--color-ink-tertiary)] font-medium">© {new Date().getFullYear()} · Hecho con amor en Chile</p>
        </div>
      </footer>
    </div>
  )
}
