'use client'
import { useState, useTransition } from 'react'
import { Plus, X, Check, Loader2 } from 'lucide-react'
import { upsertService } from '@/app/actions/services'

const CATEGORIES = [
  { value: 'manicure', label: 'Manicure' },
  { value: 'pedicure', label: 'Pedicure' },
  { value: 'gel',      label: 'Gel'      },
  { value: 'acrilico', label: 'Acrílico' },
  { value: 'nail_art', label: 'Nail Art' },
  { value: 'otros',    label: 'Otros'    },
]

const inputClass = 'w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-navy)] focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/25 transition-all shadow-sm'

export default function NewServiceForm() {
  const [open, setOpen]     = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [isPending, start]  = useTransition()

  function handleSave(formData: FormData) {
    setError(null)
    start(async () => {
      const result = await upsertService(formData)
      if (result?.error) setError(result.error)
      else setOpen(false)
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:scale-105 active:scale-95 transition-all shadow-sm"
      >
        <Plus size={16} /> Nuevo servicio
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-overlay)] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-[var(--color-navy)] tracking-tight">Nuevo servicio</h2>
          <button
            onClick={() => { setOpen(false); setError(null) }}
            className="p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-navy)] hover:bg-[var(--color-surface-container-low)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form action={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Nombre *</label>
            <input name="name" type="text" required className={inputClass} placeholder="Ej: Manicure Express" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Descripción</label>
            <textarea name="description" rows={2} className={`${inputClass} resize-none`} placeholder="Descripción del servicio…" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Categoría *</label>
            <select name="category" defaultValue="manicure" className={inputClass}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Precio (CLP) *</label>
              <input name="price" type="number" required min="0" step="500" defaultValue={15000} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--color-ink-secondary)]">Duración (min) *</label>
              <input name="duration_minutes" type="number" required min="15" step="15" defaultValue={30} className={inputClass} />
            </div>
          </div>

          {error && (
            <p className="text-xs text-[var(--color-error)] bg-[var(--color-error-bg)] px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] disabled:opacity-50 transition-all shadow-sm flex-1 justify-center"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {isPending ? 'Creando…' : 'Crear servicio'}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setError(null) }}
              className="px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
