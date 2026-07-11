import Link from 'next/link'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { n: 1, label: 'Servicio' },
  { n: 2, label: 'Fecha y hora' },
  { n: 3, label: 'Tus datos' },
  { n: 4, label: 'Confirmar' },
]

export default function StepperHeader({ current }: { current: number }) {
  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-[var(--color-border-soft)] sticky top-0 z-40 shadow-[0_1px_0_rgba(26,32,64,0.06)]">
      <div className="max-w-2xl mx-auto px-5">

        {/* Top row */}
        <div className="h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] transition-colors rounded-full px-2 py-1.5 hover:bg-[var(--color-cream)] group"
          >
            <ArrowLeft size={15} strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform" />
            Volver
          </Link>

          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] flex items-center justify-center shadow-sm">
              <Sparkles size={9} className="text-white" />
            </div>
            <span className="font-display text-sm font-semibold text-[var(--color-navy)] tracking-tight">
              Nails Art Yurany
            </span>
          </div>

          <div className="w-16" aria-hidden />
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center pb-4">
          {STEPS.map((step, i) => {
            const done    = current > step.n
            const active  = current === step.n
            const pending = current < step.n
            return (
              <div key={step.n} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    done    && 'bg-[var(--color-primary)] text-white shadow-sm',
                    active  && 'bg-[var(--color-navy)] text-white shadow-md ring-4 ring-[var(--color-navy)]/10 scale-110',
                    pending && 'bg-[var(--color-cream)] text-[var(--color-ink-muted)] border border-[var(--color-border)]',
                  )}>
                    {done ? <Check size={14} strokeWidth={2.5} /> : step.n}
                  </div>
                  <span className={cn(
                    'text-[10px] font-semibold whitespace-nowrap tracking-wide',
                    active  ? 'text-[var(--color-navy)]'
                    : done  ? 'text-[var(--color-primary-dark)]'
                    :         'text-[var(--color-ink-muted)]',
                  )}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    'w-8 h-0.5 mx-1 mb-5 rounded-full transition-all duration-300',
                    done ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]',
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
