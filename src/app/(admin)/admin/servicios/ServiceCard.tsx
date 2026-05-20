'use client'
import { useState, useTransition } from 'react'
import { Clock, Pencil, X, Check, Loader2 } from 'lucide-react'
import { formatCLP } from '@/lib/utils'
import { upsertService } from '@/app/actions/services'
import ToggleActive from './ToggleActive'

const CATEGORIES = [
  { value: 'manicure', label: 'Manicure' },
  { value: 'pedicure', label: 'Pedicure' },
  { value: 'gel',      label: 'Gel'      },
  { value: 'acrilico', label: 'Acrílico' },
  { value: 'nail_art', label: 'Nail Art' },
  { value: 'otros',    label: 'Otros'    },
]

type Service = {
  id: string
  name: string
  description: string | null
  category: string
  duration_minutes: number
  price: number
  is_active: boolean
}

const inputClass = 'w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-navy)] focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/25 transition-all shadow-sm'

export default function ServiceCard({ svc }: { svc: Service }) {
  const [editing, setEditing] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [isPending, start]    = useTransition()

  function handleSave(formData: FormData) {
    setError(null)
    start(async () => {
      const result = await upsertService(formData)
      if (result?.error) setError(result.error)
      else setEditing(false)
    })
  }

  return (
    <div className={[
      'bg-[var(--color-surface)] rounded-2xl border transition-all duration-200',
      editing
        ? 'border-[var(--color-primary)] shadow-[var(--shadow-raised)]'
        : svc.is_active
          ? 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-[var(--shadow-card)]'
          : 'border-[var(--color-border-soft)] opacity-60',
    ].join(' ')}>

      {/* ── MODO VISTA ───────────────────────────────────────────── */}
      {!editing && (
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-[var(--color-navy)] leading-snug">{svc.name}</h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-navy)] hover:bg-[var(--color-surface-container-low)] transition-colors"
                title="Editar"
              >
                <Pencil size={14} />
              </button>
              <ToggleActive id={svc.id} isActive={svc.is_active} />
            </div>
          </div>
          {svc.description && (
            <p className="text-xs text-[var(--color-ink-secondary)] mb-4 line-clamp-2 leading-relaxed">{svc.description}</p>
          )}
          <div className="flex items-center justify-between pt-2.5 border-t border-[var(--color-border-soft)]">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-ink-secondary)]">
              <Clock size={12} className="text-[var(--color-primary-dark)]" /> {svc.duration_minutes} min
            </span>
            <span className="text-sm font-bold text-[var(--color-dorado-dark)]">{formatCLP(svc.price)}</span>
          </div>
        </div>
      )}

      {/* ── MODO EDICIÓN ─────────────────────────────────────────── */}
      {editing && (
        <form action={handleSave} className="p-5 space-y-4">
          <input type="hidden" name="id" value={svc.id} />

          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-primary-dark)]">Editando servicio</p>
            <button
              type="button"
              onClick={() => { setEditing(false); setError(null) }}
              className="p-1 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-navy)] hover:bg-[var(--color-surface-container-low)] transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Nombre */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Nombre *</label>
            <input
              name="name" type="text" required
              defaultValue={svc.name}
              className={inputClass}
              placeholder="Nombre del servicio"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Descripción</label>
            <textarea
              name="description" rows={2}
              defaultValue={svc.description ?? ''}
              className={`${inputClass} resize-none`}
              placeholder="Descripción del servicio…"
            />
          </div>

          {/* Categoría */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Categoría *</label>
            <select name="category" defaultValue={svc.category} className={inputClass}>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Precio + Duración */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Precio (CLP) *</label>
              <input
                name="price" type="number" required min="0" step="500"
                defaultValue={svc.price}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Duración (min) *</label>
              <input
                name="duration_minutes" type="number" required min="15" step="15"
                defaultValue={svc.duration_minutes}
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-[var(--color-error)] bg-[var(--color-error-bg)] px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-navy)] text-white text-xs font-bold rounded-full hover:bg-[var(--color-navy-light)] disabled:opacity-50 transition-all shadow-sm"
            >
              {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              {isPending ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setError(null) }}
              className="px-4 py-2 text-xs font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
