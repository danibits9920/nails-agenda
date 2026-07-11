import { Skeleton } from '@/components/ui/skeleton'

export default function ServiciosLoading() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>

      <Skeleton className="h-14 w-full rounded-2xl" />

      <div className="space-y-8">
        {[0, 1].map(g => (
          <div key={g} className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[0, 1, 2].map(i => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
