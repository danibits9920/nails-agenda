import { createClient } from '@/lib/supabase/server'
import { Settings, Wrench } from 'lucide-react'
import MaintenanceToggle from './MaintenanceToggle'

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'maintenance_mode')
    .single()

  const isMaintenanceOn = data?.value === 'true'

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Settings size={22} className="text-[var(--color-primary-dark)]" />
        <div>
          <h1 className="font-display text-page text-[var(--color-navy)]">
            Ajustes
          </h1>
          <p className="text-sm font-medium text-[var(--color-ink-secondary)]">
            Ajustes generales del sitio
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-[var(--shadow-card)]">
        <div className="px-5 py-4 border-b border-[var(--color-border-soft)]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            <h2 className="text-eyebrow uppercase text-[var(--color-primary-dark)]">
              Disponibilidad
            </h2>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-status-pending-bg)] flex items-center justify-center shrink-0 mt-0.5">
                <Wrench size={16} className="text-[var(--color-status-pending-text)]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--color-navy)]">Modo mantenimiento</p>
                <p className="text-xs text-[var(--color-ink-secondary)] mt-0.5 leading-relaxed">
                  Cuando está activo, los visitantes ven una página de mantenimiento. El panel admin sigue accesible.
                </p>
                {isMaintenanceOn && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending-text)] border border-[var(--color-status-pending-accent)] text-micro uppercase rounded-full">
                    Activo ahora
                  </span>
                )}
              </div>
            </div>
            <MaintenanceToggle isOn={isMaintenanceOn} />
          </div>
        </div>
      </div>
    </div>
  )
}
