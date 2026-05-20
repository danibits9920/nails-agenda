'use client'
import { crearReserva } from '@/app/actions/reservas'
import { useActionState, useState } from 'react'

const PAY_OPTIONS = [
  { value: 'presencial', label: 'Pago presencial', desc: 'Pagas directamente el día de tu cita.' },
  { value: 'transfer',   label: 'Transferencia bancaria', desc: 'Te enviamos los datos para transferir.' },
]

export default function DatosForm({
  serviceId, fecha, start, end,
}: { serviceId: string; fecha: string; start: string; end: string }) {
  const [state, action, pending] = useActionState(crearReserva, null)
  const [payMethod, setPayMethod] = useState('presencial')

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="fecha"      value={fecha} />
      <input type="hidden" name="start_time" value={start} />
      <input type="hidden" name="end_time"   value={end} />
      <input type="hidden" name="pay_method" value={payMethod} />

      {/* Nombre */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--color-ink-secondary)]" htmlFor="name">
          Nombre completo <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          id="name" name="name" type="text" required
          placeholder="Tu nombre"
          className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-dorado)] focus:ring-2 focus:ring-[var(--color-dorado)]/20 transition-colors"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--color-ink-secondary)]" htmlFor="email">
          Email <span className="text-[var(--color-ink-muted)] font-normal">(para la confirmación)</span>
        </label>
        <input
          id="email" name="email" type="email"
          placeholder="tu@email.com"
          className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-dorado)] focus:ring-2 focus:ring-[var(--color-dorado)]/20 transition-colors"
        />
      </div>

      {/* Teléfono */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--color-ink-secondary)]" htmlFor="phone">
          Teléfono / WhatsApp
        </label>
        <input
          id="phone" name="phone" type="tel"
          placeholder="+56 9 XXXX XXXX"
          className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-dorado)] focus:ring-2 focus:ring-[var(--color-dorado)]/20 transition-colors"
        />
      </div>

      {/* Notas */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[var(--color-ink-secondary)]" htmlFor="notes">
          Notas <span className="text-[var(--color-ink-muted)] font-normal">(opcional — diseño, color, alergias…)</span>
        </label>
        <textarea
          id="notes" name="notes" rows={3}
          placeholder="Ej: quiero flores en el dedo anular, alergia al acrílico…"
          className="w-full px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-dorado)] focus:ring-2 focus:ring-[var(--color-dorado)]/20 transition-colors resize-none"
        />
      </div>

      {/* Método de pago */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--color-ink-secondary)]">Método de pago</p>
        {PAY_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className={`flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border cursor-pointer transition-colors ${
              payMethod === opt.value
                ? 'border-[var(--color-dorado)] bg-[var(--color-surface)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]'
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
              payMethod === opt.value ? 'border-[var(--color-dorado)] bg-[var(--color-dorado)]' : 'border-[var(--color-border-strong)]'
            }`}>
              {payMethod === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <input type="radio" name="pay_method_ui" value={opt.value} checked={payMethod === opt.value} onChange={() => setPayMethod(opt.value)} className="sr-only" />
              <p className="text-sm font-medium text-[var(--color-navy)]">{opt.label}</p>
              <p className="text-xs text-[var(--color-ink-tertiary)] mt-0.5">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {state?.error && (
        <p className="text-sm text-[var(--color-error)] bg-[var(--color-error-bg)] px-4 py-2.5 rounded-[var(--radius-md)]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3.5 bg-[var(--color-navy)] text-white font-semibold rounded-full hover:bg-[var(--color-navy-light)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
      >
        {pending ? 'Confirmando…' : 'Confirmar reserva'}
      </button>
    </form>
  )
}
