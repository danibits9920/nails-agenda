import { Wrench } from 'lucide-react'

export const metadata = { title: 'En mantenimiento — Nails Art Yurany' }

export default function MantenimientoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary-light)]/40 flex items-center justify-center mx-auto">
          <Wrench size={28} className="text-[var(--color-primary-dark)]" />
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)] mb-2">
            Nails Art Yurany
          </p>
          <h1 className="font-display text-2xl font-bold text-[var(--color-navy)] mb-2 tracking-tight">
            En mantenimiento
          </h1>
          <p className="text-sm text-[var(--color-ink-secondary)] leading-relaxed">
            Estamos realizando mejoras en nuestra plataforma. Volvemos muy pronto.
          </p>
        </div>

        <p className="text-xs text-[var(--color-ink-muted)]">
          Para agendar tu cita contáctanos directamente por WhatsApp o Instagram.
        </p>
      </div>
    </div>
  )
}
