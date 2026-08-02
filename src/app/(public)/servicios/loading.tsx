import { Skeleton } from '@/components/ui/skeleton'

export default function ServiciosLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-[var(--color-cream)]/90 backdrop-blur-xl border-b border-[var(--color-border-soft)]">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-12 space-y-8">
        {/* Encabezado */}
        <div className="space-y-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        {/* Filtros de categoría */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[20, 24, 22, 20, 24].map((w, i) => (
            <Skeleton key={i} className="h-8 rounded-full shrink-0" style={{ width: `${w * 4}px` }} />
          ))}
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex items-center justify-between pt-3.5 border-t border-[var(--color-border-soft)]">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
