'use client'
import { useState, useTransition } from 'react'
import { Pencil, X, Check, Loader2, Plus } from 'lucide-react'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories'

export type Category = { id: string; slug: string; label: string; display_order: number }

const inputCls = 'px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white text-sm text-[var(--color-navy)] focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all'

export default function CategoryManager({ categories: initial }: { categories: Category[] }) {
  const [categories, setCategories]   = useState(initial)
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [editLabel, setEditLabel]     = useState('')
  const [adding, setAdding]           = useState(false)
  const [newLabel, setNewLabel]       = useState('')
  const [error, setError]             = useState<string | null>(null)
  const [isPending, start]            = useTransition()

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditLabel(cat.label)
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditLabel('')
    setError(null)
  }

  function handleUpdate(cat: Category) {
    const fd = new FormData()
    fd.append('id', cat.id)
    fd.append('label', editLabel)
    start(async () => {
      setError(null)
      const res = await updateCategory(fd)
      if (res.error) { setError(res.error); return }
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, label: editLabel } : c))
      setEditingId(null)
    })
  }

  function handleDelete(cat: Category) {
    if (!confirm(`¿Eliminar la categoría "${cat.label}"? Los servicios con esta categoría quedarán sin categoría asignada.`)) return
    start(async () => {
      setError(null)
      const res = await deleteCategory(cat.id)
      if (res.error) { setError(res.error); return }
      setCategories(prev => prev.filter(c => c.id !== cat.id))
    })
  }

  function handleCreate() {
    const fd = new FormData()
    fd.append('label', newLabel)
    start(async () => {
      setError(null)
      const res = await createCategory(fd)
      if (res.error) { setError(res.error); return }
      setAdding(false)
      setNewLabel('')
      // La página se revalida — refrescamos con router si queremos
      // Por ahora el servidor envía la nueva categoría en el próximo render
      window.location.reload()
    })
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
            Categorías
          </h2>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setError(null) }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-primary-dark)] bg-[var(--color-primary-light)]/20 hover:bg-[var(--color-primary-light)]/40 rounded-full transition-colors"
          >
            <Plus size={12} /> Nueva
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <div key={cat.id}>
            {editingId === cat.id ? (
              /* ── Modo edición ── */
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary-light)]/15 border border-[var(--color-primary)] rounded-full">
                <input
                  autoFocus
                  value={editLabel}
                  onChange={e => setEditLabel(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleUpdate(cat); if (e.key === 'Escape') cancelEdit() }}
                  className="w-24 text-xs font-semibold bg-transparent border-none outline-none text-[var(--color-navy)]"
                />
                <button
                  onClick={() => handleUpdate(cat)}
                  disabled={isPending || !editLabel.trim()}
                  className="text-[var(--color-primary-dark)] hover:text-green-600 disabled:opacity-40"
                >
                  {isPending ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                </button>
                <button onClick={cancelEdit} className="text-[var(--color-ink-muted)] hover:text-[var(--color-navy)]">
                  <X size={11} />
                </button>
              </div>
            ) : (
              /* ── Modo vista ── */
              <div className="group flex items-center gap-1 px-3 py-1.5 bg-[var(--color-surface-container-low)] border border-[var(--color-border)] rounded-full hover:border-[var(--color-primary)]/50 transition-colors">
                <span className="text-xs font-semibold text-[var(--color-navy)]">{cat.label}</span>
                <span className="text-[10px] text-[var(--color-ink-muted)] ml-1 font-mono">{cat.slug}</span>
                <button
                  onClick={() => startEdit(cat)}
                  className="ml-1 text-[var(--color-ink-muted)] hover:text-[var(--color-navy)] opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Editar"
                >
                  <Pencil size={10} />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  disabled={isPending}
                  className="text-[var(--color-ink-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                  title="Eliminar"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* ── Formulario nueva categoría ── */}
        {adding && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary-light)]/15 border border-[var(--color-primary)] rounded-full">
            <input
              autoFocus
              placeholder="Nombre…"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newLabel.trim()) handleCreate(); if (e.key === 'Escape') { setAdding(false); setNewLabel('') } }}
              className="w-28 text-xs font-semibold bg-transparent border-none outline-none text-[var(--color-navy)] placeholder-[var(--color-ink-muted)]"
            />
            <button
              onClick={handleCreate}
              disabled={isPending || !newLabel.trim()}
              className="text-[var(--color-primary-dark)] hover:text-green-600 disabled:opacity-40"
            >
              {isPending ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
            </button>
            <button
              onClick={() => { setAdding(false); setNewLabel(''); setError(null) }}
              className="text-[var(--color-ink-muted)] hover:text-[var(--color-navy)]"
            >
              <X size={11} />
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-[var(--color-ink-muted)] mt-3">
        El slug se genera automáticamente del nombre y no cambia al editar.
      </p>
    </div>
  )
}
