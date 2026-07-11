'use client'
import { verifyPayment, rejectPayment } from '@/app/actions/payments'
import { useTransition } from 'react'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function PaymentActions({ paymentId, appointmentId }: { paymentId: string; appointmentId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button
        disabled={pending}
        onClick={() => startTransition(async () => {
          const result = await verifyPayment(paymentId, appointmentId)
          if (result?.error) toast.error(result.error)
          else toast.success('Pago verificado')
        })}
        className="h-10 px-4 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:text-green-800"
      >
        <Check size={14} /> Verificar
      </Button>
      <Button
        variant="destructive"
        disabled={pending}
        onClick={() => startTransition(async () => {
          const result = await rejectPayment(paymentId)
          if (result?.error) toast.error(result.error)
          else toast.success('Pago rechazado')
        })}
        className="h-10 px-4"
      >
        <X size={14} /> Rechazar
      </Button>
    </div>
  )
}
