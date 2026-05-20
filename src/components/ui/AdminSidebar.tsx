'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, ClipboardList,
  Users, Scissors, CreditCard, BarChart3, Clock, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/actions/auth'

const navItems = [
  { href: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/calendario', label: 'Calendario', icon: Calendar        },
  { href: '/admin/citas',      label: 'Citas',      icon: ClipboardList   },
  { href: '/admin/clientes',   label: 'Clientes',   icon: Users           },
  { href: '/admin/servicios',  label: 'Servicios',  icon: Scissors        },
  { href: '/admin/horario',    label: 'Horario',    icon: Clock           },
  { href: '/admin/pagos',      label: 'Pagos',      icon: CreditCard      },
  { href: '/admin/reportes',   label: 'Reportes',   icon: BarChart3       },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[var(--color-cream)] border-r border-[var(--color-border)] shrink-0">

      {/* Marca */}
      <div className="px-6 py-6 border-b border-[var(--color-border)]">
        <h1 className="font-display text-lg font-semibold text-[var(--color-navy)] leading-tight">
          Nails Art Yurany
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium border-l-[3px] transition-colors',
                active
                  ? 'border-[var(--color-primary)] bg-[var(--color-surface-raised)] text-[var(--color-navy)]'
                  : 'border-transparent text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-navy)]'
              )}
            >
              <Icon
                size={17}
                className={active ? 'text-[var(--color-primary-dark)]' : 'opacity-60'}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[var(--color-border)]">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-ink-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-colors border-l-[3px] border-transparent"
          >
            <LogOut size={17} className="opacity-60" />
            Cerrar sesión
          </button>
        </form>
      </div>

    </aside>
  )
}
