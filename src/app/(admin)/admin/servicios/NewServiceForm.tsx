'use client'
import { useId, useState, useTransition } from 'react'
import { Plus, Check, Loader2 } from 'lucide-react'
import { upsertService } from '@/app/actions/services'
import { toast } from 'sonner'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import type { Category } from './CategoryManager'

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-white text-base md:text-sm text-[var(--color-navy)] focus-visible:border-[var(--color-primary-dark)] transition-all shadow-sm'
const labelClass = 'block text-xs font-semibold text-[var(--color-ink-secondary)]'

export default function NewServiceForm({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)
  const [isPending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const id = useId()

  function handleSave(formData: FormData) {
    setError(null)
    start(async () => {
      const result = await upsertService(formData)
      if (result?.error) {
        // El error se queda dentro del formulario además del toast: si el
        // toast se desvanece, el motivo del fallo no se va con él.
        setError(result.error)
        toast.error(result.error)
        return
      }
      toast.success('Servicio creado')
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => { setError(null); setOpen(true) }}
        className="flex items-center gap-2 px-5 py-2.5 min-h-11 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] hover:scale-105 active:scale-95 transition-all shadow-sm"
      >
        <Plus size={16} aria-hidden /> Nuevo servicio
      </button>

      {/* Diálogo real: role, aria-modal, trampa de foco, cierre con Escape y
          devolución del foco al botón que lo abrió — todo lo que la versión
          hecha a mano con `fixed inset-0` no tenía. */}
      <Dialog
        open={open}
        onOpenChange={(o) => { if (!isPending) { setOpen(o); if (!o) setError(null) } }}
      >
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle>Nuevo servicio</DialogTitle>
            <DialogDescription>
              Aparecerá en el catálogo público apenas lo guardes.
            </DialogDescription>
          </DialogHeader>

          <form action={handleSave} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor={`${id}-name`} className={labelClass}>
                Nombre <span className="text-[var(--color-error-text)]" aria-hidden>*</span>
              </label>
              <input
                id={`${id}-name`} name="name" type="text" required
                maxLength={80} autoComplete="off"
                className={inputClass} placeholder="Ej: Manicure Express"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor={`${id}-desc`} className={labelClass}>Descripción</label>
              <textarea
                id={`${id}-desc`} name="description" rows={2} maxLength={300}
                className={`${inputClass} resize-none`} placeholder="Descripción del servicio…"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor={`${id}-cat`} className={labelClass}>
                Categoría <span className="text-[var(--color-error-text)]" aria-hidden>*</span>
              </label>
              {/* Las categorías vienen de la base, no de una lista fija: antes
                  este formulario tenía seis categorías escritas a mano y no veía
                  las que se creaban desde el gestor de categorías. */}
              <select id={`${id}-cat`} name="category" required defaultValue={categories[0]?.slug ?? ''} className={inputClass}>
                {categories.length === 0 && <option value="">Sin categorías — crea una primero</option>}
                {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor={`${id}-price`} className={labelClass}>
                  Precio (CLP) <span className="text-[var(--color-error-text)]" aria-hidden>*</span>
                </label>
                <input
                  id={`${id}-price`} name="price" type="number" required
                  min="0" max="9999999" step="500" defaultValue={15000}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`${id}-dur`} className={labelClass}>
                  Duración (min) <span className="text-[var(--color-error-text)]" aria-hidden>*</span>
                </label>
                <input
                  id={`${id}-dur`} name="duration_minutes" type="number" required
                  min="15" max="480" step="15" defaultValue={30}
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-xs font-semibold text-[var(--color-error-text)] bg-[var(--color-error-bg)] border border-[var(--color-error)]/30 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <DialogFooter className="mt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-4 py-2.5 min-h-11 text-sm font-semibold text-[var(--color-ink-secondary)] hover:text-[var(--color-navy)] rounded-full hover:bg-[var(--color-surface-container-low)] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || categories.length === 0}
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-11 bg-[var(--color-navy)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-navy-light)] disabled:opacity-50 transition-all shadow-sm"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Check size={14} aria-hidden />}
                {isPending ? 'Creando…' : 'Crear servicio'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
