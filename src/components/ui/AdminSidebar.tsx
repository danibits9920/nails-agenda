'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, ClipboardList,
  Users, Scissors, CreditCard, BarChart3, Clock, LogOut, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import BrandMark from '@/components/ui/BrandMark'
import { logout } from '@/app/actions/auth'
import { ADMIN_BASE } from '@/lib/admin-path'

const navItems = [
  { href: `${ADMIN_BASE}/dashboard`,     label: 'Resumen',        icon: LayoutDashboard },
  { href: `${ADMIN_BASE}/calendario`,    label: 'Agenda semanal', icon: Calendar        },
  { href: `${ADMIN_BASE}/citas`,         label: 'Citas',         icon: ClipboardList   },
  { href: `${ADMIN_BASE}/clientes`,      label: 'Clientes',      icon: Users           },
  { href: `${ADMIN_BASE}/servicios`,     label: 'Servicios',     icon: Scissors        },
  { href: `${ADMIN_BASE}/horario`,       label: 'Horario',       icon: Clock           },
  { href: `${ADMIN_BASE}/pagos`,         label: 'Pagos',         icon: CreditCard      },
  { href: `${ADMIN_BASE}/reportes`,      label: 'Reportes',      icon: BarChart3       },
  { href: `${ADMIN_BASE}/configuracion`, label: 'Ajustes',        icon: Settings        },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-dvh bg-[var(--color-cream)] border-r border-[var(--color-border)] shrink-0">

      {/* Marca */}
      <div className="px-5 py-5 border-b border-[var(--color-border)]">
        <div className="group flex items-center gap-3">
          <BrandMark size={48} priority className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-[-8deg] group-hover:scale-105" />
          <div>
            <h1 className="font-display text-base font-bold text-[var(--color-navy)] leading-tight tracking-tight">
              Nails Art Yurany
            </h1>
            <p className="text-micro text-[var(--color-primary-dark)]">Panel de gestión</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav aria-label="Navegación del panel" className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'press group flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium border-l-[3px] transition-[color,background-color,border-color,transform] duration-200',
                active
                  ? 'border-[var(--color-primary)] bg-[var(--color-surface-raised)] text-[var(--color-navy)]'
                  : 'border-transparent text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-navy)]'
              )}
            >
              <Icon
                size={17}
                className={cn('transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5', active ? 'text-[var(--color-primary-dark)]' : 'opacity-60')}
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
            className="tap-target justify-start flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-ink-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-colors border-l-[3px] border-transparent"
          >
            <LogOut size={17} className="opacity-60" />
            Cerrar sesión
          </button>
        </form>
      </div>

    </aside>
  )
}
