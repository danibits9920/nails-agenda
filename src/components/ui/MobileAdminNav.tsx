'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Users, Scissors, Settings2, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const bottomItems = [
  { href: '/admin/calendario', label: 'Agenda',    icon: Calendar        },
  { href: '/admin/citas',      label: 'Citas',     icon: LayoutDashboard },
  { href: '/admin/clientes',   label: 'Clientes',  icon: Users           },
  { href: '/admin/servicios',  label: 'Servicios', icon: Scissors        },
  { href: '/admin/horario',    label: 'Ajustes',   icon: Settings2       },
]

export function MobileTopBar() {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[var(--color-navy)] text-white shrink-0 safe-top">
      <h1 className="font-display text-base font-semibold leading-tight tracking-tight">
        💅 Nails Art Yurany
      </h1>
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
        Y
      </div>
    </header>
  )
}

export function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[var(--color-border)] flex items-stretch safe-bottom">
      {bottomItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors',
              active
                ? 'text-[var(--color-primary-dark)]'
                : 'text-[var(--color-ink-muted)] hover:text-[var(--color-navy)]'
            )}
          >
            <Icon size={19} strokeWidth={active ? 2.2 : 1.6} />
            <span className={cn('text-[9px] font-bold tracking-wide', active ? '' : 'opacity-70')}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
