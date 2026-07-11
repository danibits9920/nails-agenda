import { createClient } from '@/lib/supabase/server'
import { formatCLP } from '@/lib/utils'
import Link from 'next/link'
import {
  Clock, Sparkles, Star, MapPin, Heart,
  AtSign, Phone, CheckCircle2, ChevronRight,
} from 'lucide-react'

/* ── Paleta de colores de uñas (decorativa) ─────────────────────── */
const NAIL_COLORS = [
  '#EDAAB5', '#D4BCEC', '#1A2040',
  '#D4AF37', '#F5C0C0', '#B89ED6',
  '#E57373', '#F9A8D4', '#FFFFFF',
]

const CATEGORY_LABELS: Record<string, string> = {
  manicure: 'Manicure',
  pedicure: 'Pedicure',
  gel:      'Gel',
  acrilico: 'Acrílico',
  nail_art: 'Nail Art',
  otros:    'Otros',
}

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

const TESTIMONIALS = [
  { name: 'Carolina M.',  stars: 5, text: 'Yurany es increíble. El nail art quedó exactamente como lo imaginé. Super limpia y detallista.' },
  { name: 'Valentina R.', stars: 5, text: 'El gel dura más que con cualquier otra manicurista que he ido. El ambiente es muy acogedor.' },
  { name: 'Daniela F.',   stars: 5, text: 'Excelente servicio y muy puntual. Ya agendé mi segunda cita. ¡100% recomendada!' },
]

const STATS = [
  { value: '+200', label: 'Clientas felices',      color: 'var(--color-primary-dark)' },
  { value: '5★',   label: 'Valoración Google',      color: 'var(--color-dorado-dark)' },
  { value: '6+',   label: 'Tipos de servicio',      color: 'var(--color-lavanda-dark)' },
  { value: '100%', label: 'Materiales premium',     color: 'var(--color-navy)' },
]

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

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[var(--color-cream)]/90 backdrop-blur-xl border-b border-[var(--color-border-soft)]">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] shadow-sm flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-display font-bold text-[15px] text-[var(--color-navy)] tracking-tight">
              Nails Art Yurany
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/servicios"
              className="hidden sm:inline text-sm font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] transition-colors"
            >
              Servicios
            </Link>
            <Link
              href="/reservar"
              className="px-5 py-2.5 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              Reservar cita
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)]/25 via-[var(--color-cream)] to-[var(--color-lavanda)]/20 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[var(--color-primary-light)]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[var(--color-lavanda)]/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 py-16 md:py-24">
          <div className="grid md:grid-cols-2 md:items-center md:gap-16">

            {/* Texto */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-[var(--color-primary)]/30 rounded-full text-xs font-semibold text-[var(--color-primary-dark)] mb-6 shadow-sm">
                <Sparkles size={12} className="text-[var(--color-dorado)]" />
                Uñas que cuentan tu historia
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-navy)] leading-[1.1] mb-5 tracking-tight">
                El arte de cuidar<br />
                <span className="bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-lavanda-dark)] bg-clip-text text-transparent">
                  tus uñas
                </span>
              </h1>
              <p className="text-[15px] md:text-lg text-[var(--color-ink-secondary)] mb-8 leading-relaxed font-medium max-w-md">
                Manicure, pedicure, gel, acrílico y nail art de alta calidad.
                Agenda tu cita en minutos.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/reservar"
                  className="px-8 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md hover:shadow-lg text-center text-[15px]"
                >
                  Reserva tu cita →
                </Link>
                <Link
                  href="/servicios"
                  className="px-8 py-3.5 bg-white/70 backdrop-blur-sm text-[var(--color-navy)] font-semibold rounded-full border border-[var(--color-border-strong)] hover:border-[var(--color-navy)] hover:bg-white hover:-translate-y-0.5 transition-all shadow-sm text-center text-[15px]"
                >
                  Ver servicios
                </Link>
              </div>

              {/* Trust pills */}
              <div className="flex flex-wrap items-center gap-2 mt-7">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[var(--color-border)] rounded-full text-xs font-semibold text-[var(--color-ink-secondary)] shadow-sm">
                  <Star size={12} className="fill-[var(--color-dorado)] text-[var(--color-dorado)]" />
                  5.0 valoración
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[var(--color-border)] rounded-full text-xs font-semibold text-[var(--color-ink-secondary)] shadow-sm">
                  <Heart size={11} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />
                  +200 clientas
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[var(--color-border)] rounded-full text-xs font-semibold text-[var(--color-ink-secondary)] shadow-sm">
                  <MapPin size={12} className="text-[var(--color-primary-dark)]" />
                  Santiago, Chile
                </div>
              </div>
            </div>

            {/* Visual decorativo — paleta de colores de uñas */}
            <div className="hidden md:flex items-center justify-center mt-8 md:mt-0">
              <div className="relative w-72 h-72">
                {/* Glow de fondo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-primary)]/30 to-[var(--color-lavanda)]/30 blur-2xl" />
                {/* Círculo principal */}
                <div className="absolute inset-3 rounded-full bg-white/90 border border-[var(--color-border)] shadow-[0_20px_60px_rgba(237,170,181,0.35)] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)] mb-1">
                      Colores disponibles
                    </p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {NAIL_COLORS.map((color, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full shadow-md hover:scale-110 transition-transform duration-200 cursor-default"
                          style={{
                            backgroundColor: color,
                            border: color === '#FFFFFF' ? '2px solid #EDAAB5' : undefined,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating badge — rating */}
                <div className="absolute -top-3 -right-3 bg-white border border-[var(--color-border)] rounded-2xl px-3 py-2 shadow-lg text-center">
                  <p className="text-lg font-bold text-[var(--color-navy)] leading-none">5.0</p>
                  <div className="flex gap-0.5 mt-1 justify-center">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={8} className="fill-[var(--color-dorado)] text-[var(--color-dorado)]" />
                    ))}
                  </div>
                  <p className="text-[9px] text-[var(--color-ink-muted)] mt-0.5">Google</p>
                </div>
                {/* Floating badge — clientas */}
                <div className="absolute -bottom-3 -left-6 bg-white border border-[var(--color-border)] rounded-2xl px-3 py-2 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Heart size={10} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />
                    <div>
                      <p className="text-[11px] font-bold text-[var(--color-navy)]">+200 clientas</p>
                      <p className="text-[9px] text-[var(--color-ink-muted)]">nos eligen</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sobre Yurany ─────────────────────────────────────────────── */}
      <section className="border-y border-[var(--color-border-soft)] bg-white py-14">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-[1fr_1.6fr] md:gap-16 md:items-center gap-10">

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
        <div className="flex items-end justify-between mb-8">
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
          {services?.map((svc) => (
            <Link
              key={svc.id}
              href={`/reservar?service=${svc.id}`}
              className="group flex flex-col bg-white rounded-2xl border border-[var(--color-border)] p-5 hover:border-[var(--color-primary)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)] transition-all duration-200"
            >
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
                <span className="text-sm font-bold text-[var(--color-dorado-dark)]">
                  {formatCLP(svc.price)}
                </span>
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

      {/* ── Cómo agendar ─────────────────────────────────────────────── */}
      <section className="bg-[var(--color-surface-raised)] border-y border-[var(--color-border-soft)] py-16">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-1.5">Proceso sencillo</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">¿Cómo agendar?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.n} className="text-center group relative">
                {i < 3 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-px bg-[var(--color-border)] z-0" />
                )}
                <div className="relative z-10 w-11 h-11 rounded-full bg-white border-2 border-[var(--color-primary)]/30 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary-light)]/20 transition-all duration-200">
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
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md hover:shadow-lg text-[15px]"
            >
              Empezar ahora
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonios ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-1.5">Opiniones</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">
            Lo que dicen mis clientas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map(({ name, stars, text }) => (
            <div
              key={name}
              className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[var(--color-dorado)] text-[var(--color-dorado)]" />
                ))}
              </div>
              <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed mb-4 italic">
                &ldquo;{text}&rdquo;
              </p>
              <p className="text-xs font-bold text-[var(--color-navy)]">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-primary)]/20 shadow-[var(--shadow-card)]">
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
              className="inline-block px-10 py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:scale-105 active:scale-95 transition-all shadow-md text-[15px]"
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
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] shadow-sm flex items-center justify-center">
                  <Sparkles size={11} className="text-white" />
                </div>
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
