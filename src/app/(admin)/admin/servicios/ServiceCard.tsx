'use client'
import { useId, useState, useTransition } from 'react'
import { Clock, Pencil, X, Check, Loader2 } from 'lucide-react'
import { formatCLP } from '@/lib/utils'
import { upsertService } from '@/app/actions/services'
import { toast } from 'sonner'
import ToggleActive from './ToggleActive'
import ServiceImageGallery, { type ServiceImage } from './ServiceImageGallery'
import type { Category } from './CategoryManager'

type Service = {
 id: string
 name: string
 description: string | null
 category: string
  duration_minutes: number
 price: number
  is_active: boolean
}

const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-base md:text-sm text-[var(--color-navy)] focus-visible:border-[var(--color-primary-dark)] transition-all shadow-sm'

export default function ServiceCard({ svc, images, categories }: { svc: Service; images: ServiceImage[]; categories: Category[] }) {
  const [editing, setEditing] = useState(false)
  const [isPending, start]    = useTransition()
  // Se renderiza una tarjeta por servicio: los ids tienen que ser únicos por
  // instancia o las etiquetas apuntarían todas al primer formulario.
  const id = useId()

  function handleSave(formData: FormData) {
    start(async () => {
      const result = await upsertService(formData)
      if (result?.error) toast.error(result.error)
      else { toast.success('Servicio guardado'); setEditing(false) }
    })
  }

  return (
    <div className={[
      'rounded-2xl border transition-all duration-200',
      editing
        ? 'bg-[var(--color-surface)] border-[var(--color-primary)] shadow-[var(--shadow-raised)]'
        : svc.is_active
          ? 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-[var(--shadow-card)]'
          // Un servicio inactivo se señala con la superficie y con su
          // interruptor, no apagando el texto: opacity-60 dejaba el precio en
          // 2.35:1 y el nombre en 4.30:1.
          : 'bg-[var(--color-surface-container)] border-[var(--color-border-soft)]',
    ].join(' ')}>

      {/* ── MODO VISTA ───────────────────────────────────────────── */}
      {!editing && (
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-[var(--color-navy)] leading-snug min-w-0 break-words hyphens-auto">{svc.name}</h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setEditing(true)}
                aria-label="Editar servicio"
                title="Editar servicio"
                className="tap-target p-2 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-navy)] hover:bg-[var(--color-surface-container-low)] transition-colors"
              >
                <Pencil size={14} />
              </button>
              <ToggleActive id={svc.id} isActive={svc.is_active} />
            </div>
          </div>

          {svc.description && (
            <p className="text-xs text-[var(--color-ink-secondary)] mb-3 line-clamp-2 leading-relaxed">
              {svc.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2.5 border-t border-[var(--color-border-soft)]">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink-secondary)]">
              <Clock size={12} className="text-[var(--color-primary-dark)]" /> {svc.duration_minutes} min
            </span>
            <span className="text-sm font-bold text-[var(--color-dorado-dark)] tabular-nums">{formatCLP(svc.price)}</span>
          </div>

          <ServiceImageGallery serviceId={svc.id} images={images} serviceName={svc.name} />
        </div>
      )}

      {/* ── MODO EDICIÓN ─────────────────────────────────────────── */}
      {editing && (
        <form action={handleSave} className="p-5 space-y-4">
          <input type="hidden" name="id" value={svc.id} />

          <div className="flex items-center justify-between mb-1">
            <p className="text-eyebrow uppercase text-[var(--color-primary-dark)]">Editando servicio</p>
            <button
              type="button"
              onClick={() => { setEditing(false) }}
              aria-label="Cancelar edición"
              className="tap-target p-2 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-navy)] hover:bg-[var(--color-surface-container-low)] transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-1">
            <label htmlFor={`${id}-name`} className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Nombre <span className="text-[var(--color-error-text)]" aria-hidden>*</span></label>
            <input
              id={`${id}-name`} name="name" type="text" required maxLength={80}
              defaultValue={svc.name}
              className={inputClass}
              placeholder="Nombre del servicio"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor={`${id}-desc`} className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Descripción</label>
            <textarea
              id={`${id}-desc`} name="description" rows={2} maxLength={300}
              defaultValue={svc.description ?? ''}
              className={`${inputClass} resize-none`}
              placeholder="Descripción del servicio…"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor={`${id}-cat`} className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Categoría <span className="text-[var(--color-error-text)]" aria-hidden>*</span></label>
            <select id={`${id}-cat`} name="category" required defaultValue={svc.category} className={inputClass}>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor={`${id}-price`} className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Precio (CLP) <span className="text-[var(--color-error-text)]" aria-hidden>*</span></label>
              <input
                id={`${id}-price`} name="price" type="number" required min="0" max="9999999" step="500"
                defaultValue={svc.price}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor={`${id}-dur`} className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Duración (min) <span className="text-[var(--color-error-text)]" aria-hidden>*</span></label>
              <input
                id={`${id}-dur`} name="duration_minutes" type="number" required min="15" max="480" step="15"
                defaultValue={svc.duration_minutes}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-1.5 px-4 py-2 min-h-11 bg-[var(--color-navy)] text-white text-xs font-bold rounded-full hover:bg-[var(--color-navy-light)] disabled:opacity-50 transition-all shadow-sm"
            >
              {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              {isPending ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false) }}
              className="px-4 py-2 min-h-11 text-xs font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
