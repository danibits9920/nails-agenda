import { createClient } from '@/lib/supabase/server'
import { Scissors } from 'lucide-react'
import ServiceCard from './ServiceCard'
import NewServiceForm from './NewServiceForm'
import type { ServiceImage } from './ServiceImageGallery'

const CATEGORY_LABELS: Record<string, string> = {
  manicure: 'Manicure', pedicure: 'Pedicure',
  nail_art: 'Nail Art', gel: 'Gel',
  acrilico: 'Acrílico', otros: 'Otros',
}

export default async function ServiciosPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*, service_images(id, url, storage_path, display_order)')
    .order('category')
    .order('name')

  const grouped = (services ?? []).reduce<Record<string, typeof services>>((acc, s) => {
    if (!s) return acc
    const cat = s.category
    if (!acc[cat]) acc[cat] = []
    acc[cat]!.push(s)
    return acc
  }, {})

  const totalActive = services?.filter(s => s?.is_active).length ?? 0

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Scissors size={22} className="text-[var(--color-primary-dark)]" />
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-navy)] tracking-tight">Servicios</h1>
          </div>
          <p className="text-sm font-medium text-[var(--color-ink-secondary)] ml-9">
            {totalActive} servicio{totalActive !== 1 ? 's' : ''} activo{totalActive !== 1 ? 's' : ''}
          </p>
        </div>
        <NewServiceForm />
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items?.map((svc) => {
                if (!svc) return null
                const images = (svc.service_images as ServiceImage[] | null) ?? []
                return <ServiceCard key={svc.id} svc={svc} images={images} />
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
