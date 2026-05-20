import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { n: 1, label: 'Servicio' },
  { n: 2, label: 'Fecha y hora' },
  { n: 3, label: 'Tus datos' },
  { n: 4, label: 'Pago' },
]

export default function StepperHeader({ current }: { current: number }) {
  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-6">
        {/* Top row */}
        <div className="h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] transition-colors">
            <ArrowLeft size={15} /> Volver
          </Link>
          <span className="font-display text-sm font-semibold text-[var(--color-navy)]">Nails Art Yurany</span>
          <div className="w-16" />
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center pb-4 gap-1">
          {STEPS.map((step, i) => {
            const done    = current > step.n
            const active  = current === step.n
            const pending = current < step.n
            return (
              <div key={step.n} className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                    done    && 'bg-[var(--color-dorado)] text-white',
                    active  && 'bg-[var(--color-navy)] text-white',
                    pending && 'bg-[var(--color-surface-raised)] text-[var(--color-ink-muted)] border border-[var(--color-border)]',
                  )}>
                    {done ? <Check size={13} /> : step.n}
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium whitespace-nowrap',
                    active  ? 'text-[var(--color-navy)]' : 'text-[var(--color-ink-muted)]'
                  )}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    'w-10 h-px mb-4 transition-colors',
                    done ? 'bg-[var(--color-dorado)]' : 'bg-[var(--color-border)]'
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
