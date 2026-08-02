import { Skeleton } from '@/components/ui/skeleton'

export default function HorarioLoading() {
  return (
    <div className="p-4 md:p-8 max-w-3xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-7 w-56" />
        </div>
        <Skeleton className="h-4 w-64 ml-9" />
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border-soft)] last:border-0">
            <Skeleton className="h-5 w-11 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <div className="flex-1" />
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
