import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import BrandMark from '@/components/ui/BrandMark'
import HeroVideo from '@/components/motion/HeroVideo'
import {
  Clock, Sparkles, MapPin,
  AtSign, Phone, CheckCircle2, ChevronRight, ChevronDown,
} from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  manicure: 'Manicure',
  pedicure: 'Pedicure',
  gel:      'Gel',
  acrilico: 'Acrílico',
  nail_art: 'Nail Art',
  otros:    'Otros' }

const FEATURES = [
  'Materiales de alta calidad y seguros',
  'Ambiente íntimo y personalizado',
  'Agenda online 24/7 sin llamadas',
]

const STEPS = [
  { n: '01', title: 'Elige tu servicio',  desc: 'Explora el catálogo y selecciona el servicio que prefieres.' },
  { n: '02', title: 'Selecciona fecha',   desc: 'Elige el día y horario disponible que mejor te acomode.' },
  { n: '03', title: 'Tus datos',          desc: 'Ingresa tu nombre y contacto para confirmar la reserva.' },
  { n: '04', title: 'Confirma y listo',   desc: 'Paga online o presencial. Recibe confirmación por email.' },
]

const STATS = [
  { value: '6+',   label: 'Tipos de servicio',  color: 'var(--color-lavanda-dark)' },
  { value: '100%', label: 'Materiales premium', color: 'var(--color-navy)' },
]

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, name, description, category, duration_minutes, price, service_images(url, display_order)')
    .eq('is_active', true)
    .order('category')
    .limit(6)

  return (
    <div className="min-h-screen bg-[var(--color-cream)] selection:bg-[var(--color-primary-light)]">

      {/* ── Portada ──────────────────────────────────────────────────
          Video a sangre completa bajo un velo de papel crema que se abre
          hacia la derecha: el texto descansa sobre papel, el trabajo se ve
          al costado. En móvil el velo cubre más para que el título se lea. */}
      <section className="relative isolate overflow-hidden min-h-[min(88svh,760px)] md:min-h-[min(86vh,820px)] flex flex-col">
        <HeroVideo
          poster="/video/portada.jpg"
          sources={[
            { src: '/video/portada.webm', type: 'video/webm' },
            { src: '/video/portada.mp4',  type: 'video/mp4' },
          ]}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-cream)]/85 via-[var(--color-cream)]/70 to-[var(--color-cream)] md:bg-gradient-to-r md:from-[var(--color-cream)] md:via-[var(--color-cream)]/80 md:to-[var(--color-cream)]/10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-cream)] to-transparent pointer-events-none" />

        {/* Nav sobre la portada; al hacer scroll queda fija sobre papel. */}
        <nav className="sticky top-0 z-50 bg-[var(--color-cream)]/75 backdrop-blur-xl border-b border-[var(--color-border-soft)]">
          <div className="max-w-5xl mx-auto px-5 h-[72px] flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <BrandMark size={48} priority className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-[-8deg] group-hover:scale-105" />
              <span className="font-display font-bold text-lg text-[var(--color-navy)] tracking-tight">
                Nails Art Yurany
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/servicios"
                className="hidden sm:inline text-sm font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] transition-colors"
              >
                Servicios
              </Link>
              <Link
                href="/reservar"
                className="sheen press px-5 py-2.5 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] shadow-sm"
              >
                Reservar cita
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative flex-1 flex items-center">
          <div className="max-w-5xl w-full mx-auto px-5 py-16 md:py-24">
            <div className="max-w-xl">
              {/* El medallón en grande: la marca se presenta antes que el título. */}
              <div className="logo-pop relative mb-6 w-20 md:w-28 aspect-square [&>img]:!w-full [&>img]:!h-full">
                <div className="absolute -inset-3 rounded-full bg-[var(--color-primary-light)]/40 blur-xl" aria-hidden="true" />
                <BrandMark size={112} alt="Nails Art Yurany" priority className="relative drop-shadow-[0_10px_24px_rgba(26,32,64,0.18)]" />
              </div>
              <div
                className="hero-fade inline-flex items-center gap-2 px-4 py-1.5 bg-white/85 backdrop-blur-sm border border-[var(--color-primary)]/30 rounded-full text-xs font-semibold text-[var(--color-primary-dark)] mb-6"
                style={{ '--i': -6 } as React.CSSProperties}
              >
                <Sparkles size={12} className="text-[var(--color-dorado)]" />
                Uñas que cuentan tu historia
              </div>

              <h1 className="font-display font-bold text-[var(--color-navy)] leading-[1.05] tracking-tight mb-6 text-[clamp(2.5rem,7vw,4.5rem)] text-balance">
                <span className="line-mask"><span className="line-rise" style={{ '--i': 0 } as React.CSSProperties}>El arte de cuidar</span></span>
                <span className="line-mask">
                  <span className="line-rise relative" style={{ '--i': 1 } as React.CSSProperties}>
                    tus uñas
                    {/* La pincelada de esmalte: se pinta cuando el título ya llegó. */}
                    <svg
                      className="polish-stroke absolute left-0 -bottom-[0.12em] w-full h-[0.32em] overflow-visible"
                      viewBox="0 0 300 24"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 15 C 70 6, 150 5, 296 11"
                        pathLength={1}
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
              </h1>

              <p
                className="hero-fade text-[15px] md:text-lg text-[var(--color-ink-secondary)] mb-8 leading-relaxed font-medium max-w-md"
                style={{ '--i': 1 } as React.CSSProperties}
              >
                Manicure, pedicure, gel, acrílico y nail art de alta calidad.
                Agenda tu cita en minutos.
              </p>

              <div className="hero-fade flex flex-col sm:flex-row items-stretch sm:items-center gap-3" style={{ '--i': 2 } as React.CSSProperties}>
                <Link
                  href="/reservar"
                  className="sheen press group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] shadow-md hover:shadow-lg text-[15px]"
                >
                  Reserva tu cita
                  <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/servicios"
                  className="press px-8 py-3.5 bg-white/75 backdrop-blur-sm text-[var(--color-navy)] font-semibold rounded-full border border-[var(--color-border-strong)] hover:border-[var(--color-navy)] hover:bg-white text-center text-[15px]"
                >
                  Ver servicios
                </Link>
              </div>

              <div className="hero-fade flex flex-wrap items-center gap-2 mt-7" style={{ '--i': 3 } as React.CSSProperties}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/85 backdrop-blur-sm border border-[var(--color-border)] rounded-full text-xs font-semibold text-[var(--color-ink-secondary)]">
                  <Clock size={12} className="text-[var(--color-primary-dark)]" />
                  Agenda online 24/7
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/85 backdrop-blur-sm border border-[var(--color-border)] rounded-full text-xs font-semibold text-[var(--color-ink-secondary)]">
                  <MapPin size={12} className="text-[var(--color-primary-dark)]" />
                  Santiago, Chile
                </div>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#sobre-mi"
          className="hero-fade relative mx-auto mb-6 hidden md:flex flex-col items-center gap-1 text-micro uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-navy)] transition-colors"
          style={{ '--i': 5 } as React.CSSProperties}
        >
          Descubre más
          <ChevronDown size={16} className="scroll-cue" />
        </a>
      </section>

      {/* ── Sobre Yurany ─────────────────────────────────────────────── */}
      <section id="sobre-mi" className="border-y border-[var(--color-border-soft)] bg-white py-14 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-5">
          <div data-reveal className="grid md:grid-cols-[1fr_1.6fr] md:gap-16 md:items-center gap-10">

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(({ value, label, color }) => (
                <div
                  key={label}
                  className="bg-[var(--color-cream)] rounded-2xl p-5 border border-[var(--color-border-soft)] hover:shadow-sm transition-shadow"
                >
                  <p className="font-display text-2xl font-bold mb-1" style={{ color }}>{value}</p>
                  <p className="text-xs font-semibold text-[var(--color-ink-secondary)] leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Texto */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-2">Sobre mí</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight mb-4">
                Hola, soy Yurany
              </h2>
              <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed mb-5">
                Soy manicurista profesional especializada en nail art, gel y acrílico.
                Mi misión es que salgas de cada cita sintiéndote 100% tú — con uñas perfectas
                y un servicio lleno de dedicación y amor.
              </p>
              <div className="space-y-2.5">
                {FEATURES.map(feat => (
                  <div key={feat} className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-[var(--color-primary-dark)] shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-ink-secondary)]">{feat}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/reservar"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-[var(--color-primary-dark)] hover:text-[var(--color-navy)] transition-colors group"
              >
                Agendar con Yurany
                <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Servicios destacados ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div data-reveal className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-1.5">Catálogo</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">
              Nuestros servicios
            </h2>
          </div>
          <Link
            href="/servicios"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-navy)] transition-colors group"
          >
            Ver todos
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services?.map((svc, i) => (
            <div key={svc.id} data-reveal className="flex" style={{ '--i': i } as React.CSSProperties}>
            <Link
              href={`/reservar?service=${svc.id}`}
              className="group flex-1 flex flex-col overflow-hidden bg-white rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:-translate-y-1 hover:shadow-[var(--shadow-overlay)] active:translate-y-0 transition-[transform,box-shadow,border-color,opacity] duration-300 ease-[var(--ease-out)]"
            >
              {(() => {
                const foto = [...(svc.service_images ?? [])].sort((a, b) => a.display_order - b.display_order)[0]
                return (
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface-container)]">
                    {foto ? (
                      <Image
                        src={foto.url}
                        alt={svc.name}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={22} className="text-[var(--color-primary-dark)]/60" />
                      </div>
                    )}
                  </div>
                )
              })()}
              <div className="flex-1 flex flex-col p-5">
              <span className="self-start text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-3 bg-[var(--color-primary-light)]/30 text-[var(--color-primary-dark)]">
                {CATEGORY_LABELS[svc.category] ?? svc.category}
              </span>
              <h3 className="font-display font-semibold text-base text-[var(--color-navy)] mb-2 group-hover:text-[var(--color-primary-dark)] transition-colors leading-snug flex-1">
                {svc.name}
              </h3>
              {svc.description && (
                <p className="text-xs text-[var(--color-ink-secondary)] mb-4 line-clamp-2 leading-relaxed">
                  {svc.description}
                </p>
              )}
              <div className="flex items-center justify-between pt-3.5 border-t border-[var(--color-border-soft)]">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-ink-secondary)] bg-[var(--color-cream)] px-2.5 py-1 rounded-full border border-[var(--color-border-soft)]">
                  <Clock size={11} className="text-[var(--color-primary-dark)]" />
                  {svc.duration_minutes} min
                </span>
                <span className="text-sm font-bold tabular-nums text-[var(--color-dorado-dark)]">
                  {formatCLP(svc.price)}
                </span>
              </div>
              </div>
            </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <Link href="/servicios" className="text-sm font-semibold text-[var(--color-primary-dark)] hover:underline">
            Ver todos los servicios →
          </Link>
        </div>
      </section>

      {/* ── Cómo agendar ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-raised)] border-y border-[var(--color-border-soft)] py-16">
        <div className="max-w-5xl mx-auto px-5">
          <div data-reveal className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-1.5">Proceso sencillo</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">¿Cómo agendar?</h2>
          </div>

          <div data-reveal className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.n} className="text-center group relative">
                {i < 3 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-px bg-[var(--color-primary)]/60 z-0 draw-x" />
                )}
                <div className="relative z-10 w-11 h-11 rounded-full bg-white border-2 border-[var(--color-primary)]/30 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary-light)]/20 transition-[border-color,background-color,transform] duration-300 group-hover:scale-110">
                  <span className="text-xs font-bold text-[var(--color-primary-dark)]">{step.n}</span>
                </div>
                <h3 className="font-semibold text-[var(--color-navy)] text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-[var(--color-ink-secondary)] leading-relaxed px-2">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/reservar"
              className="sheen press group inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] shadow-md hover:shadow-lg text-[15px]"
            >
              Empezar ahora
              <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <div data-reveal className="relative overflow-hidden rounded-3xl border border-[var(--color-primary)]/20 shadow-[var(--shadow-card)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)]/30 via-white/90 to-[var(--color-lavanda)]/20" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[var(--color-lavanda)]/20 blur-3xl" />
          <div className="relative z-10 px-8 py-14 md:px-14 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-3">Reserva online</p>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-[var(--color-navy)] mb-3 tracking-tight">
              ¿Lista para consentir tus manos?
            </h2>
            <p className="text-sm md:text-base text-[var(--color-ink-secondary)] mb-8 max-w-sm mx-auto font-medium leading-relaxed">
              Agenda tu hora en línea en menos de 2 minutos y asegura tu espacio con Yurany.
            </p>
            <Link
              href="/reservar"
              className="sheen press inline-block px-10 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] shadow-md hover:shadow-lg text-[15px]"
            >
              Reservar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--color-border-soft)] bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto px-5 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

            {/* Marca */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <BrandMark size={30} />
                <span className="font-display font-bold text-sm text-[var(--color-navy)]">Nails Art Yurany</span>
              </div>
              <p className="text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                Manicurista profesional especializada en nail art, gel y acrílico. Santiago, Chile.
              </p>
            </div>

            {/* Servicios */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-secondary)] mb-4">Servicios</p>
              <ul className="space-y-2">
                {['Manicure', 'Pedicure', 'Gel', 'Acrílico', 'Nail Art'].map(s => (
                  <li key={s}>
                    <Link
                      href="/servicios"
                      className="text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] transition-colors"
                    >
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-secondary)] mb-4">Contacto</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-[var(--color-ink-secondary)]">
                  <MapPin size={13} className="text-[var(--color-primary-dark)] shrink-0" />
                  Santiago, Chile
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--color-ink-secondary)]">
                  <AtSign size={13} className="text-[var(--color-primary-dark)] shrink-0" />
                  @nailsartyurany
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--color-ink-secondary)]">
                  <Phone size={13} className="text-[var(--color-primary-dark)] shrink-0" />
                  WhatsApp disponible
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--color-border-soft)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-ink-tertiary)] font-medium">
              © {new Date().getFullYear()} Nails Art Yurany · Hecho con amor en Chile
            </p>
            <Link
              href="/reservar"
              className="text-xs font-semibold text-[var(--color-primary-dark)] hover:text-[var(--color-navy)] transition-colors inline-flex items-center gap-1 group"
            >
              Agenda tu cita
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
