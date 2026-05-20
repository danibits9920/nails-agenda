'use client'
import { useState, useTransition, useRef } from 'react'
import Image from 'next/image'
import { X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { uploadServiceImage, deleteServiceImage } from '@/app/actions/services'

export type ServiceImage = {
  id:           string
  url:          string
  storage_path: string
  display_order: number
}

type Props = {
  serviceId: string
  images:    ServiceImage[]
}

const MAX = 8

export default function ServiceImageGallery({ serviceId, images }: Props) {
  const router                  = useRouter()
  const [isPending, start]      = useTransition()
  const [error, setError]       = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const fileRef                 = useRef<HTMLInputElement>(null)

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (images.length >= MAX) {
      setError(`Máximo ${MAX} fotos por servicio`)
      return
    }

    const fd = new FormData()
    fd.append('file', file)

    start(async () => {
      setError(null)
      const result = await uploadServiceImage(serviceId, fd)
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  function handleDelete(id: string, storagePath: string) {
    setDeleting(id)
    start(async () => {
      setError(null)
      const result = await deleteServiceImage(id, storagePath)
      setDeleting(null)
      if (result.error) setError(result.error)
      else router.refresh()
    })
  }

  const sorted = [...images].sort((a, b) => a.display_order - b.display_order)

  return (
    <div className="pt-4 border-t border-[var(--color-border-soft)] space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-ink-secondary)]">
          Galería de trabajos
        </p>
        <p className="text-[10px] text-[var(--color-ink-muted)] font-medium">
          {images.length}/{MAX}
        </p>
      </div>

      {error && (
        <p className="text-xs text-[var(--color-error,#dc2626)] bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="grid grid-cols-4 gap-2">
        {sorted.map(img => (
          <div
            key={img.id}
            className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-surface-container-low)]"
          >
            <Image
              src={img.url}
              alt="Trabajo"
              fill
              className="object-cover"
              sizes="80px"
            />
            <button
              onClick={() => handleDelete(img.id, img.storage_path)}
              disabled={isPending}
              aria-label="Eliminar imagen"
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-red-500 transition-colors disabled:cursor-not-allowed"
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
            className="aspect-square rounded-xl border-2 border-dashed border-[var(--color-primary)]/40 bg-[var(--color-primary-light)]/10 hover:bg-[var(--color-primary-light)]/20 hover:border-[var(--color-primary)] text-[var(--color-primary-dark)] flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending && !deleting
              ? <Loader2 size={16} className="animate-spin" />
              : <span className="text-xl leading-none font-light">+</span>
            }
            <span className="text-[9px] font-semibold">Agregar</span>
          </button>
        )}
      </div>

      <p className="text-[10px] text-[var(--color-ink-muted)]">
        JPG, PNG, WEBP · máx. 2 MB
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  )
}
