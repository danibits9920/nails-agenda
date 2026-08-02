import { Skeleton } from '@/components/ui/skeleton'

export default function ConfiguracionLoading() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)]">
        <div className="px-5 py-4 border-b border-[var(--color-border-soft)]">
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="px-5 py-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </div>
    </div>
  )
}
