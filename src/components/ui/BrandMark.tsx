import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * La marca de Nails Art Yurany.
 *
 * Hasta ahora la marca se dibujaba a mano en ocho sitios: un círculo con
 * degradado rosa→lavanda y un icono de destellos dentro. El logotipo real
 * existía en el repositorio desde el principio y no se usaba en ninguna
 * parte. Este componente es el único lugar donde vive.
 *
 * El logotipo es un medallón: un círculo opaco con el nombre dentro, así que
 * se apoya sobre cualquier fondo —incluida la barra navy del móvil— sin
 * necesitar contorno ni relleno propio.
 *
 * Sobre el tamaño: por debajo de unos 28px el medallón funciona como firma
 * de color y forma, no como nombre legible ("Nails Art" desaparece). Por eso
 * en navegación va siempre acompañado del nombre en texto, que es el par
 * habitual de marca + logotipo, y no una repetición.
 */
export default function BrandMark({
  size = 32,
  className,
  /**
   * Vacío por defecto: en navegación el nombre ya está en el texto contiguo,
   * y anunciarlo dos veces a un lector de pantalla es ruido. Cuando el
   * logotipo va solo —el acceso al panel, el encabezado de un email— se le
   * pasa un texto real.
   */
  alt = '',
  priority = false,
}: {
  size?: number
  className?: string
  alt?: string
  priority?: boolean
}) {
  return (
    <Image
      src="/logo-yurany.png"
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      aria-hidden={alt === '' || undefined}
      className={cn('shrink-0 select-none', className)}
      style={{ width: size, height: size }}
    />
  )
}
