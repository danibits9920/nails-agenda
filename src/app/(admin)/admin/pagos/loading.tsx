import { Skeleton } from '@/components/ui/skeleton'

export default function PagosLoading() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border-soft)] last:border-0">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
