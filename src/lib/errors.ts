/**
 * Traducción de errores de base de datos a lenguaje del negocio.
 *
 * Las server actions devolvían `error.message` tal cual, así que Yurany veía
 * cosas como «duplicate key value violates unique constraint» en un toast.
 * Un error tiene que decir qué pasó y qué hacer, en el idioma del producto.
 */

type DbError = { code?: string; message?: string } | null | undefined

const POR_CODIGO: Record<string, string> = {
  '23505': 'Ya existe un registro con ese nombre. Usa uno distinto.',
  '23503': 'No se puede completar: hay otros datos que dependen de este.',
  '23514': 'Alguno de los valores está fuera de lo permitido. Revisa el formulario.',
  '23P01': 'Ese horario acaba de ocuparse. Elige otro.',
  '22P02': 'Alguno de los valores tiene un formato inesperado.',
  'PGRST116': 'No se encontró el registro. Puede que ya se haya eliminado.',
  '42501': 'Tu sesión no tiene permiso para esta acción. Vuelve a iniciar sesión.',
}

const POR_TEXTO: [RegExp, string][] = [
  [/jwt|token|session|not authenticated|unauthorized/i,
   'Tu sesión expiró. Vuelve a iniciar sesión para continuar.'],
  [/fetch failed|network|timeout|ETIMEDOUT|ECONNREFUSED/i,
   'No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.'],
  [/payload too large|exceeded the maximum/i,
   'El archivo es demasiado grande.'],
  [/rate limit|too many requests/i,
   'Demasiados intentos seguidos. Espera unos segundos e intenta de nuevo.'],
]

/**
 * @param err       el error de Supabase/Postgres
 * @param respaldo  qué decir cuando no se reconoce el error; debe ser
 *                  específico de la acción, nunca «Ocurrió un error»
 */
export function mensajeDeError(err: DbError, respaldo: string): string {
  if (!err) return respaldo
  if (err.code && POR_CODIGO[err.code]) return POR_CODIGO[err.code]!
  if (err.message) {
    for (const [patron, texto] of POR_TEXTO) {
      if (patron.test(err.message)) return texto
    }
  }
  return respaldo
}
