'use client'
import { verifyPayment, rejectPayment } from '@/app/actions/payments'
import { useTransition } from 'react'
import { Check, X } from 'lucide-react'

export default function PaymentActions({ paymentId, appointmentId }: { paymentId: string; appointmentId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        disabled={pending}
        onClick={() => startTransition(() => { verifyPayment(paymentId, appointmentId) })}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 rounded-[var(--radius-sm)] hover:bg-green-100 disabled:opacity-50 transition-colors"
      >
        <Check size={13} /> Verificar
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => { rejectPayment(paymentId) })}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 rounded-[var(--radius-sm)] hover:bg-red-100 disabled:opacity-50 transition-colors"
      >
        <X size={13} /> Rechazar
      </button>
    </div>
  )
}
