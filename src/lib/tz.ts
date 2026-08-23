/**
 * Zona horaria del negocio.
 *
 * El servidor corre en UTC, así que `new Date().toISOString()` no da el día
 * que es en el salón: entre las 20:00 y la medianoche de Chile, UTC ya pasó
 * al día siguiente. El panel calculaba "hoy" así, de modo que cada tarde,
 * durante tres o cuatro horas, el resumen mostraba las citas de mañana bajo
 * el título "Citas de hoy" y el calendario marcaba el día equivocado.
 *
 * `src/app/actions/reservas.ts` ya resolvía esto con estas mismas funciones
 * en privado; aquí quedan en un solo sitio para que no vuelvan a divergir.
 */

export const BUSINESS_TZ = 'America/Santiago'

/** 'YYYY-MM-DD' de hoy en la zona del negocio. */
export function todayInBusinessTz(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: BUSINESS_TZ })
}

/** 'HH:MM:SS' de la hora actual en la zona del negocio. */
export function nowTimeInBusinessTz(): string {
  return new Date().toLocaleTimeString('en-GB', { timeZone: BUSINESS_TZ, hour12: false })
}

/** La hora del día (0–23) en la zona del negocio. Para saludos y cortes. */
export function hourInBusinessTz(): number {
  return Number(nowTimeInBusinessTz().slice(0, 2))
}

/**
 * Inicio del mes en curso, en la zona del negocio, como ISO para consultas.
 *
 * El desfase no se fija a mano: Chile alterna entre UTC-4 y UTC-3 con el
 * horario de verano, así que se busca el instante UTC cuyo reloj en Chile
 * marca el día 1 a las 00:00, sea cual sea el desfase vigente ese mes.
 */
export function startOfMonthInBusinessTz(): string {
  const [y, m] = todayInBusinessTz().split('-').map(Number)
  const sonda = new Date(Date.UTC(y!, m! - 1, 1, 12, 0, 0))
  const local = sonda.toLocaleString('en-CA', { timeZone: BUSINESS_TZ, hour12: false })
  const [hh, mm, ss] = local.split(', ')[1]!.split(':').map(Number)
  const desdeMedianoche = (hh! * 3600 + mm! * 60 + ss!) * 1000
  return new Date(sonda.getTime() - desdeMedianoche).toISOString()
}

/** El año en curso en la zona del negocio. */
export function yearInBusinessTz(): string {
  return todayInBusinessTz().slice(0, 4)
}

/** Fecha larga en español de Chile, en la zona del negocio. */
export function longDateInBusinessTz(): string {
  return new Date().toLocaleDateString('es-CL', {
    timeZone: BUSINESS_TZ,
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
