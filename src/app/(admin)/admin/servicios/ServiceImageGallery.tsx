'use client'
import { useState, useTransition, useRef } from 'react'
import Image from 'next/image'
import { X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { uploadServiceImage, deleteServiceImage } from '@/app/actions/services'
import { toast } from 'sonner'
import ConfirmModal from '@/components/ui/ConfirmModal'

export type ServiceImage = {
 id:           string
 url:          string
  storage_path: string
  display_order: number
}

type Props = {
  serviceId: string
 images:    ServiceImage[]
  /** Da nombre a las fotos y al diálogo de borrado. */
  serviceName?: string
}

const MAX = 8

export default function ServiceImageGallery({ serviceId, images, serviceName }: Props) {
  const router                  = useRouter()
  const [isPending, start]      = useTransition()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<ServiceImage | null>(null)
  const fileRef                 = useRef<HTMLInputElement>(null)

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (images.length >= MAX) {
      toast.error(`Máximo ${MAX} fotos por servicio. Elimina una para subir otra.`)
      return
    }

    // Se comprueba aquí además de en el servidor: subir 5 MB por una red móvil
    // para que el servidor lo rechace es tiempo y datos de Yurany.
    if (file.size > 2 * 1024 * 1024) {
      toast.error(`Esa foto pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 2 MB.`)
      return
    }

    const fd = new FormData()
    fd.append('file', file)

    start(async () => {
      const result = await uploadServiceImage(serviceId, fd)
      if (result.error) toast.error(result.error)
      else router.refresh()
    })
  }

  function confirmDelete() {
    const img = confirming
    if (!img) return
    setConfirming(null)
    setDeleting(img.id)
    start(async () => {
      const result = await deleteServiceImage(img.id, img.storage_path)
      setDeleting(null)
      if (result.error) toast.error(result.error)
      else { toast.success('Foto eliminada'); router.refresh() }
    })
  }

  const sorted = [...images].sort((a, b) => a.display_order - b.display_order)

  return (
    <div className="pt-4 border-t border-[var(--color-border-soft)] space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-eyebrow uppercase text-[var(--color-ink-secondary)]">
          Galería de trabajos
        </p>
        <p className="text-micro text-[var(--color-ink-muted)]">
          {images.length}/{MAX}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {sorted.map(img => (
          <div
            key={img.id}
            className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-surface-container-low)]"
          >
            <Image
              src={img.url}
              alt={serviceName ? `Trabajo de ${serviceName}` : 'Trabajo realizado'}
              fill
              className="object-cover"
              sizes="80px"
            />
            <button
              onClick={() => setConfirming(img)}
              disabled={isPending}
              aria-label={`Eliminar la foto ${sorted.indexOf(img) + 1} de ${sorted.length}`}
              className="tap-halo absolute top-1 right-1 w-5 h-5 rounded-full bg-[var(--color-navy)]/70 text-white flex items-center justify-center hover:bg-[var(--color-error-text)] transition-colors disabled:cursor-not-allowed"
            >
              {deleting === img.id
                ? <Loader2 size={9} className="animate-spin" />
                : <X size={9} />
              }
            </button>
          </div>
        ))}

        {images.length < MAX && (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isPending}
            aria-label={`Agregar foto (${images.length} de ${MAX})`}
            className="aspect-square rounded-xl border-2 border-dashed border-[var(--color-primary)]/40 bg-[var(--color-primary-light)]/10 hover:bg-[var(--color-primary-light)]/20 hover:border-[var(--color-primary)] text-[var(--color-primary-dark)] flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending && !deleting
              ? <Loader2 size={16} className="animate-spin" />
              : <span className="text-xl leading-none font-light">+</span>
            }
            <span className="text-micro">Agregar</span>
          </button>
        )}
      </div>

      <p className="text-micro text-[var(--color-ink-muted)]">
        JPG, PNG, WEBP · máx. 2 MB
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Seleccionar una foto para subir"
        tabIndex={-1}
        className="hidden"
        onChange={handleUpload}
      />

      {/* Borrar una foto es definitivo y el botón es un círculo de 20px
          encima de la miniatura: demasiado fácil de pulsar sin querer. */}
      <ConfirmModal
        open={confirming !== null}
        pending={isPending}
        title="¿Eliminar esta foto?"
        description={serviceName
          ? `Se quitará de la galería de ${serviceName} y del catálogo público. No se puede deshacer.`
          : 'Se quitará de la galería y del catálogo público. No se puede deshacer.'}
        confirmLabel="Eliminar foto"
        cancelLabel="Conservarla"
        onConfirm={confirmDelete}
        onCancel={() => setConfirming(null)}
      />
    </div>
  )
}
