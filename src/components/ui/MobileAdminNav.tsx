'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Users, Scissors, Settings, LayoutDashboard, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ADMIN_BASE } from '@/lib/admin-path'

const bottomItems = [
  { href: `${ADMIN_BASE}/calendario`,    label: 'Agenda',    icon: Calendar        },
  { href: `${ADMIN_BASE}/citas`,         label: 'Citas',     icon: LayoutDashboard },
  { href: `${ADMIN_BASE}/clientes`,      label: 'Clientes',  icon: Users           },
  { href: `${ADMIN_BASE}/servicios`,     label: 'Servicios', icon: Scissors        },
  { href: `${ADMIN_BASE}/configuracion`, label: 'Config',    icon: Settings        },
]

export function MobileTopBar() {
  return (
    <header className="md:hidden flex items-center justify-between px-4 h-14 bg-[var(--color-navy)] text-white shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-lavanda)] flex items-center justify-center shadow-sm">
          <Sparkles size={11} className="text-white" />
        </div>
        <h1 className="font-display text-sm font-bold leading-tight tracking-tight">
          Nails Art Yurany
        </h1>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-xs font-bold">
        Y
      </div>
    </header>
  )
}

export function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Navegación del panel" className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[var(--color-border-soft)] flex items-stretch pb-safe">
      {bottomItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 transition-colors"
          >
            <div className={cn(
              'w-9 h-7 rounded-xl flex items-center justify-center transition-all duration-200',
              active ? 'bg-[var(--color-primary-light)]/40' : '',
            )}>
              <Icon
                size={18}
                strokeWidth={active ? 2.2 : 1.6}
                aria-hidden
                className={active ? 'text-[var(--color-primary-dark)]' : 'text-[var(--color-ink-muted)]'}
              />
            </div>
            <span className={cn(
              'text-[9px] font-bold tracking-wide transition-colors',
              active ? 'text-[var(--color-primary-dark)]' : 'text-[var(--color-ink-muted)]',
            )}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
