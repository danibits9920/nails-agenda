import { Skeleton } from '@/components/ui/skeleton'

/**
 * Sin este archivo, Next usaba el esqueleto de `clientes/`: al abrir una
 * ficha se veía por un instante la silueta de una lista, que no es lo que
 * está a punto de aparecer. Este calca la ficha: avatar, nombre, tres
 * métricas y las dos columnas de historial y notas.
 */
export default function ClienteProfileLoading() {
  return (
    <div className="p-8 max-w-4xl space-y-8">
      <Skeleton className="h-5 w-36" />

      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 space-y-3"
          >
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--color-border)]">
            <Skeleton className="h-5 w-40" />
          </div>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 border-b border-[var(--color-border-soft)] last:border-0"
            >
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 space-y-4">
          <Skeleton className="h-5 w-24" />
          {[0, 1].map(i => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
