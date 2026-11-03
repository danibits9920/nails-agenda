import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  // 'YYYY-MM-DD' se interpreta como medianoche UTC: formateado en la hora de
  // Chile caía en el día anterior. Una fecha sin hora se muestra tal cual,
  // formateándola en UTC.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
  return new Date(dateStr).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(dateOnly ? { timeZone: 'UTC' } : {}),
  })
}

export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return '—'
  return timeStr.slice(0, 5)
}
