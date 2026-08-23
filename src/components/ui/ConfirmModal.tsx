'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type Props = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /**
   * `destructive` para lo que borra o rechaza; `caution` para lo que es
   * reversible pero tiene consecuencias visibles (apagar el sitio público).
   * El color no es lo único que distingue: la etiqueta del botón nombra la
   * acción concreta, nunca «Aceptar».
   */
  tone?: 'destructive' | 'caution'
  pending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  tone = 'destructive',
  pending = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !pending) onCancel() }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={pending}
            className="h-11 px-5 rounded-full"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={pending}
            /* Cancelar es lo primero que recibe foco al abrirse: en un diálogo
               de confirmación, la tecla Enter no debe ejecutar lo irreversible. */
            className={[
              'h-11 px-5 rounded-full',
              tone === 'caution'
                ? 'bg-[var(--color-status-pending-accent)] text-white hover:brightness-95'
                : '',
            ].join(' ')}
          >
            {pending ? 'Un momento…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
