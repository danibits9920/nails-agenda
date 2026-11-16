import { BUSINESS_TZ } from '@/lib/tz'

/**
 * "Agregar a mi calendario": un enlace para Google Calendar y un archivo .ics
 * para iPhone, Outlook y el resto. Ninguno necesita cuenta ni permisos; la
 * clienta guarda el evento y es su propio teléfono el que le avisa.
 *
 * Las horas se guardan como reloj del negocio ('YYYY-MM-DD' + 'HH:MM'). Aquí
 * se pasan a UTC para que el evento caiga a la hora correcta en cualquier
 * calendario, esté donde esté la clienta.
 */

export type CitaCalendario = {
  /** Identificador estable del evento: el mismo archivo abierto dos veces no duplica la cita. */
  uid: string
  serviceName: string
  date: string
  startTime: string
  endTime: string
  /** Enlace privado para cancelar o cambiar la hora; va en la descripción. */
  manageUrl?: string
}

const NEGOCIO = 'Nails Yurany'

/**
 * Instante UTC en que el reloj del negocio marca esa fecha y hora.
 * El desfase no se fija a mano: Chile alterna entre UTC-4 y UTC-3.
 */
function businessToUtc(date: string, time: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const comoUtc = Date.UTC(y!, m! - 1, d!, hh!, mm!)
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TZ, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date(comoUtc))
  const p = (t: string) => Number(partes.find(x => x.type === t)!.value)
  const relojNegocio = Date.UTC(p('year'), p('month') - 1, p('day'), p('hour'), p('minute'))
  return new Date(comoUtc - (relojNegocio - comoUtc))
}

/** 'YYYYMMDDTHHMMSSZ', el formato que piden Google y los .ics. */
const sello = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const titulo = (c: CitaCalendario) => `${c.serviceName} · ${NEGOCIO}`

const descripcion = (c: CitaCalendario) =>
  `Tu cita en ${NEGOCIO}.` +
  (c.manageUrl ? `\n\nSi necesitas cancelar o cambiar tu hora: ${c.manageUrl}` : '')

export function googleCalendarUrl(c: CitaCalendario): string {
  const q = new URLSearchParams({
    action:  'TEMPLATE',
    text:    titulo(c),
    dates:   `${sello(businessToUtc(c.date, c.startTime))}/${sello(businessToUtc(c.date, c.endTime))}`,
    details: descripcion(c),
  })
  return `https://calendar.google.com/calendar/render?${q}`
}

const escIcs = (v: string) =>
  v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

/** El formato exige líneas de 75 bytes como máximo; las largas se continúan con un espacio. */
function plegar(linea: string): string {
  const bytes = Buffer.from(linea, 'utf8')
  if (bytes.length <= 75) return linea
  const trozos: string[] = []
  let resto = linea
  let limite = 75
  while (Buffer.byteLength(resto, 'utf8') > limite) {
    let corte = Math.min(resto.length, limite)
    while (Buffer.byteLength(resto.slice(0, corte), 'utf8') > limite) corte--
    trozos.push(resto.slice(0, corte))
    resto = resto.slice(corte)
    limite = 74 // las continuaciones llevan un espacio delante
  }
  trozos.push(resto)
  return trozos.join('\r\n ')
}

/** Archivo .ics con avisos un día antes y dos horas antes. */
export function icsCita(c: CitaCalendario): string {
  const aviso = (antes: string) => [
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escIcs(titulo(c))}`,
    `TRIGGER:-${antes}`,
    'END:VALARM',
  ]
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nails Yurany//Agenda//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${c.uid}@nailsyurany`,
    `DTSTAMP:${sello(new Date())}`,
    `DTSTART:${sello(businessToUtc(c.date, c.startTime))}`,
    `DTEND:${sello(businessToUtc(c.date, c.endTime))}`,
    `SUMMARY:${escIcs(titulo(c))}`,
    `DESCRIPTION:${escIcs(descripcion(c))}`,
    ...aviso('P1D'),
    ...aviso('PT2H'),
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(plegar).join('\r\n') + '\r\n'
}

export const ICS_FILENAME = 'cita-nails-yurany.ics'
