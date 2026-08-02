import { Skeleton } from '@/components/ui/skeleton'

export default function CitasLoading() {
  return (
    <div className="p-4 md:p-8 space-y-5 md:space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-44" />
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[16, 24, 24, 20, 24, 24].map((w, i) => (
          <Skeleton key={i} className="h-8 rounded-full shrink-0" style={{ width: `${w * 4}px` }} />
        ))}
      </div>

      {/* Lista de citas */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border-soft)] last:border-0">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
