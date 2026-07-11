'use client'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { toggleMaintenance } from '@/app/actions/config'

export default function MaintenanceToggle({ isOn }: { isOn: boolean }) {
  const [pending, start] = useTransition()

  async function handleToggle() {
    start(async () => {
      const result = await toggleMaintenance(!isOn)
      if (result?.error) toast.error(result.error)
      else toast.success(isOn ? 'Modo mantenimiento desactivado' : 'Modo mantenimiento activado')
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      aria-label={isOn ? 'Desactivar mantenimiento' : 'Activar mantenimiento'}
      className={[
        'relative shrink-0 w-14 h-7 rounded-full transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400',
        'disabled:cursor-not-allowed',
        isOn ? 'bg-amber-500' : 'bg-gray-200',
      ].join(' ')}
    >
      {pending
        ? <Loader2 size={14} className="absolute inset-0 m-auto animate-spin text-white" />
        : (
          <span className={[
            'pointer-events-none absolute top-[3px] left-[3px]',
            'h-[22px] w-[22px] rounded-full bg-white shadow-sm',
            'transition-transform duration-200',
            isOn ? 'translate-x-7' : 'translate-x-0',
          ].join(' ')} />
        )
      }
    </button>
  )
}
