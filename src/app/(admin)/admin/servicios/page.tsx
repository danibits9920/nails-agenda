import { createClient } from '@/lib/supabase/server'
import { Scissors } from 'lucide-react'
import ServiceCard from './ServiceCard'
import NewServiceForm from './NewServiceForm'
import CategoryManager from './CategoryManager'
import type { ServiceImage } from './ServiceImageGallery'
import type { Category } from './CategoryManager'

export default async function ServiciosPage() {
  const supabase = await createClient()

  const [{ data: services }, { data: rawCategories }, { data: allImages }] = await Promise.all([
    supabase.from('services').select('*').order('category').order('name'),
    supabase.from('service_categories').select('id, slug, label, display_order').order('display_order'),
    supabase.from('service_images').select('id, service_id, url, storage_path, display_order').order('display_order'),
  ])

  const categories: Category[] = rawCategories ?? []

  const categoryMap = categories.reduce<Record<string, string>>((acc, c) => {
    acc[c.slug] = c.label
    return acc
  }, {})

  const imagesByService = (allImages ?? []).reduce<Record<string, ServiceImage[]>>((acc, img) => {
    if (!img) return acc
    if (!acc[img.service_id]) acc[img.service_id] = []
    acc[img.service_id]!.push({ id: img.id, url: img.url, storage_path: img.storage_path, display_order: img.display_order })
    return acc
  }, {})

  const grouped = (services ?? []).reduce<Record<string, typeof services>>((acc, s) => {
    if (!s) return acc
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category]!.push(s)
    return acc
  }, {})

  const totalActive = services?.filter(s => s?.is_active).length ?? 0

  return (
    <div className="p-4 md:p-8 space-y-6">
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

      <CategoryManager categories={categories} />

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-dark)]">
                {categoryMap[category] ?? category}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items?.map((svc) => {
                if (!svc) return null
                return (
                  <ServiceCard
                    key={svc.id}
                    svc={svc}
                    images={imagesByService[svc.id] ?? []}
                    categories={categories}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
