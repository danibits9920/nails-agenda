'use client'
import { crearReserva } from '@/app/actions/reservas'
import { useActionState, useState } from 'react'

const PAY_OPTIONS = [
  { value: 'presencial', label: 'Pago presencial',        desc: 'Pagas directamente el día de tu cita.' },
  { value: 'transfer',   label: 'Transferencia bancaria', desc: 'Te enviamos los datos para transferir.' },
]

const inputClass = 'w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-ink)] placeholder-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/25 transition-all shadow-sm'

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
        <label className="block text-sm font-semibold text-[var(--color-ink-secondary)]" htmlFor="name">
          Nombre completo <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          id="name" name="name" type="text" required
          placeholder="Tu nombre"
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--color-ink-secondary)]" htmlFor="email">
          Email{' '}
          <span className="text-[var(--color-ink-muted)] font-normal text-xs">(para la confirmación)</span>
        </label>
        <input
          id="email" name="email" type="email"
          placeholder="tu@email.com"
          className={inputClass}
        />
      </div>

      {/* Teléfono */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--color-ink-secondary)]" htmlFor="phone">
          Teléfono / WhatsApp
        </label>
        <input
          id="phone" name="phone" type="tel"
          placeholder="+56 9 XXXX XXXX"
          className={inputClass}
        />
      </div>

      {/* Notas */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--color-ink-secondary)]" htmlFor="notes">
          Notas{' '}
          <span className="text-[var(--color-ink-muted)] font-normal text-xs">(diseño, color, alergias…)</span>
        </label>
        <textarea
          id="notes" name="notes" rows={3}
          placeholder="Ej: quiero flores en el dedo anular, alergia al acrílico…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Método de pago */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--color-ink-secondary)]">Método de pago</p>
        {PAY_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className={[
              'flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200',
              payMethod === opt.value
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/15 shadow-[var(--shadow-card)]'
                : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/60 hover:bg-[var(--color-surface-container-low)]',
            ].join(' ')}
          >
            <div className={[
              'mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200',
              payMethod === opt.value
                ? 'border-[var(--color-primary-dark)] bg-[var(--color-primary-dark)]'
                : 'border-[var(--color-border-strong)] bg-white',
            ].join(' ')}>
              {payMethod === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div>
              <input
                type="radio" name="pay_method_ui" value={opt.value}
                checked={payMethod === opt.value}
                onChange={() => setPayMethod(opt.value)}
                className="sr-only"
              />
              <p className="text-sm font-bold text-[var(--color-navy)]">{opt.label}</p>
              <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5 leading-relaxed">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {state?.error && (
        <div className="text-sm text-[var(--color-error)] bg-[var(--color-error-bg)] px-4 py-3 rounded-xl border border-[var(--color-error)]/20">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3.5 bg-[var(--color-navy)] text-white text-[15px] font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2 shadow-md hover:shadow-lg"
      >
        {pending ? 'Confirmando…' : 'Confirmar reserva →'}
      </button>
    </form>
  )
}
