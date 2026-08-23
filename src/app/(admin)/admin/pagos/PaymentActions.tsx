'use client'
import { verifyPayment, rejectPayment } from '@/app/actions/payments'
import { useState, useTransition } from 'react'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function PaymentActions({
  paymentId,
  appointmentId,
  clientName,
  amount,
}: {
  paymentId: string
  appointmentId: string
  clientName?: string | null
  amount?: string
}) {
  const [pending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function verify() {
    startTransition(async () => {
      const result = await verifyPayment(paymentId, appointmentId)
      if (result?.error) toast.error(result.error)
      else toast.success('Pago verificado · la cita quedó confirmada')
    })
  }

  function reject() {
    setConfirming(false)
    startTransition(async () => {
      const result = await rejectPayment(paymentId, appointmentId)
      if (result?.error) toast.error(result.error)
      else toast.success('Pago rechazado · la cita volvió a "Sin pagar"')
    })
  }

  const quien = clientName ? `de ${clientName}` : 'de esta cita'

  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          disabled={pending}
          onClick={verify}
          aria-label={clientName ? `Verificar el pago de ${clientName}` : 'Verificar pago'}
          className="h-11 px-4 rounded-full bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-text)] border border-[var(--color-status-completed-accent)] hover:brightness-95"
        >
          <Check size={14} aria-hidden /> Verificar
        </Button>
        <Button
          variant="destructive"
          disabled={pending}
          onClick={() => setConfirming(true)}
          aria-label={clientName ? `Rechazar el pago de ${clientName}` : 'Rechazar pago'}
          className="h-11 px-4 rounded-full"
        >
          <X size={14} aria-hidden /> Rechazar
        </Button>
      </div>

      {/* Rechazar es irreversible desde la interfaz y en móvil vive a un par de
          píxeles de "Verificar", que hace exactamente lo contrario. */}
      <ConfirmModal
        open={confirming}
        pending={pending}
        title={`¿Rechazar el pago ${quien}?`}
        description={
          amount
            ? `Se marcará el comprobante de ${amount} como rechazado y la cita volverá a "Sin pagar". Tendrás que avisarle por tu cuenta.`
            : 'El comprobante quedará rechazado y la cita volverá a "Sin pagar". Tendrás que avisarle por tu cuenta.'
        }
        confirmLabel="Rechazar el pago"
        cancelLabel="Volver"
        onConfirm={reject}
        onCancel={() => setConfirming(false)}
      />
    </>
  )
}
