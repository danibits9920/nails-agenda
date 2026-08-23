# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Clienta que reserva (usuaria principal).** Mujer en Santiago de Chile que quiere una cita de manicure, pedicure, gel, acrílico o nail art. Llega casi siempre desde el celular y muchas veces fuera del horario de atención — de noche, en el transporte, en un rato libre. Su trabajo es concreto: ver qué servicios hay, encontrar una hora que le calce y dejarla tomada sin tener que escribir por WhatsApp y quedarse esperando respuesta. No tiene cuenta ni contraseña: entra, reserva y se va.

**Yurany (administradora y única profesional).** Manicurista profesional, dueña y operadora del negocio. Usa el panel entre clienta y clienta o al cerrar el día: revisar qué tiene hoy, confirmar reservas nuevas, verificar transferencias, marcar quién no llegó, editar precios y horarios, y consultar la ficha de una clienta antes de atenderla. El trabajo reciente del repositorio se concentra en móvil (nav inferior, tablas responsive), señal de que administra buena parte del tiempo desde el teléfono.

## Product Purpose

Reemplazar la coordinación de citas por WhatsApp con una agenda que funciona 24/7 sin que Yurany tenga que responder. La clienta reserva sola en cuatro pasos; el sistema valida la disponibilidad real, impide dobles reservas y manda la confirmación y el recordatorio de la víspera por email. Del otro lado, el panel le da a Yurany el control operativo completo: agenda, catálogo, horario, cobros, clientas y reportes.

Éxito es que una clienta cierre una cita a las 11 de la noche sin hablar con nadie, que esa hora sea real, y que Yurany llegue al día siguiente sabiendo exactamente a quién atiende y qué le va a hacer.

## Positioning

Es la agenda de **una sola profesional**, no un marketplace ni software para un salón con equipo. Eso se nota en cosas que un producto genérico no hace:

- La disponibilidad se calcula contra el horario real de Yurany (dos turnos configurables día por día) y contra la duración exacta de cada servicio, no contra una grilla fija de horas.
- La base de datos, no la interfaz, es la que impide el solapamiento: dos clientas que reservan el mismo minuto no pueden ambas ganar.
- La ficha de clienta guarda alergias, preferencias y notas por sesión. Es memoria de la relación — lo que Yurany le hizo la vez pasada, a qué es alérgica, qué diseño pidió — y es lo que un marketplace genérico nunca va a tener.

## Operating Context

- **Dónde ocurre el servicio:** local/estudio propio con dirección fija en Santiago, Chile. La dirección existe y es publicable, pero todavía no está registrada en el repositorio ni en el sitio (hoy solo dice "Santiago, Chile").
- **Horario de atención:** lunes a viernes en dos turnos (08:00–12:00 y 14:00–18:00), sábado solo mañana, domingo cerrado. Es configurable desde el panel (`/admin/horario`), turno por turno y día por día.
- **Granularidad de la agenda:** los horarios se ofrecen cada 30 minutos y se generan según la duración del servicio elegido (`get_available_slots`).
- **Catálogo actual:** 10 servicios de 30 a 90 minutos, entre $5.000 y $22.000 CLP, en seis categorías (manicure, pedicure, gel, acrílico, nail art, otros). Las categorías se gestionan desde el panel.
- **Flujo público de reserva:** servicio → fecha y hora → datos de contacto y método de pago → confirmación.
- **Panel de gestión:** dashboard, calendario semanal, citas, clientes, servicios, horario, pagos, reportes y configuración.
- **Modo mantenimiento:** Yurany puede cerrar el sitio público desde configuración; el middleware redirige a `/mantenimiento`.
- **Idioma y formatos:** español de Chile en todo el producto (`es-CL`, `es_CL`), moneda CLP sin decimales, zona horaria `America/Santiago`.

## Capabilities and Constraints

**Funciona hoy:**
- Catálogo público con filtro por categoría y galería de imágenes por servicio.
- Reserva pública en cuatro pasos, sin cuenta ni registro, con toda la validación repetida en el servidor (servicio activo, fecha no pasada, hora realmente disponible, hora no vencida si es hoy).
- Protección contra doble reserva a nivel de base de datos (constraint de exclusión; el error `23P01` se traduce a un mensaje para la clienta).
- Email de confirmación al reservar y recordatorio la víspera (Resend + Supabase Edge Function).
- Panel completo: estados de cita, verificación de transferencias, ficha de clienta con notas, edición de servicios y categorías, horario de dos turnos, reportes de ingresos y ranking de servicios, modo mantenimiento.

**Planificado y aún no construido:**
- **Pago online con Flow.cl.** Es parte del producto. Hoy el paso 4 (`/reservar/pago`) y `/api/pagos` son stubs; las credenciales de Flow ya están en el entorno. Los únicos métodos que funcionan son presencial y transferencia manual verificada por Yurany.
- **SMS automático con Twilio.** Es parte del producto. Hoy `/api/notificaciones` es un stub 501; el único canal operativo es email.

**Restricciones durables:**
- **Una sola profesional.** El esquema no modela personal, sucursales ni recursos en paralelo: una cita ocupa el negocio entero. Nada futuro debe asumir equipo.
- **Sin registro público.** Existe una única cuenta con sesión, la de la administradora. La clienta no tiene login, por lo que hoy **no puede cancelar ni reprogramar sola** — tiene que contactar a Yurany.
- **El email es opcional al reservar.** Una clienta sin email queda sin confirmación ni recordatorio automático; el producto no puede depender del email como canal garantizado.
- **Estados definidos:** cita (`pending`, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show`) y pago (`unpaid`, `pending_verification`, `paid`).
- **Ruta de administración ocultable** por variable de entorno (`NEXT_PUBLIC_ADMIN_PATH`); el middleware bloquea `/admin` directo cuando hay ruta personalizada.
- **Técnicas:** Next.js 16 App Router con React 19 (Server Components y Server Actions, no SPA), Supabase (Postgres + Auth + RLS + Storage), Tailwind v4 con tokens en `@theme`, componentes shadcn/base-ui, Resend para email. Sin modo oscuro: `color-scheme` está fijo en claro y solo los tokens grises de shadcn tienen variante `dark:`.

**Terminología del panel.** Un concepto, una palabra. La navegación de escritorio y la de móvil llegaron a llamar distinto al mismo destino, así que estos nombres son ahora los únicos válidos en interfaz, copia y documentación:

| Se dice | No se dice | Qué es |
|---|---|---|
| **Resumen** | Dashboard, Inicio | La pantalla de entrada: citas de hoy, por confirmar, ingresos del mes. |
| **Agenda semanal** | Calendario, Agenda | La retícula semanal por horas y su vista de día en móvil. |
| **Ajustes** | Configuración, Config | La pantalla de opciones del sitio. |
| **No asistió** | No se presentó | El estado de una cita a la que la clienta no llegó. |
| **Clienta** | Usuaria, cliente | Quien reserva. El producto se dirige a ella en femenino. |

Los seis estados de cita —Pendiente, Confirmada, En curso, Completada, Cancelada, No asistió— y los tres de pago —Sin pagar, Por verificar, Pagado— tienen una sola tabla de nombres en `src/components/ui/status-badges.tsx`. Ningún archivo escribe estas etiquetas por su cuenta.

**Estado del proyecto:** en construcción. Todavía no lo usa ninguna clienta real, así que los flujos y los datos pueden cambiar sin romper producción.

## Brand Commitments

- **Nombre:** Nails Art Yurany.
- **Logo real:** `public/LOGO YURANY.png` — activo oficial confirmado por la usuaria. Hoy **no se usa en ninguna parte de la interfaz**: la marca se representa con un círculo degradado y un ícono. Pesa 1,4 MB sin optimizar.
- **Instagram real:** `@nailsartyurany`. Aparece en el footer como texto plano, sin enlace.
- **WhatsApp / teléfono real:** existe y es publicable. El número todavía no está registrado en el repositorio; el footer solo dice "WhatsApp disponible".
- **Dominio de marca:** `nailsartyurany.cl` (usado como remitente de los emails).
- **Voz:** primera persona de Yurany, cercana y tuteo, dirigida en femenino a la clienta ("Hola, soy Yurany", "¿Lista para consentir tus manos?"). Español de Chile.

## Evidence on Hand

**Real y utilizable:**
- Logo oficial en `public/LOGO YURANY.png`.
- Cuenta de Instagram `@nailsartyurany`.
- Número de WhatsApp real (pendiente de registrar aquí).
- **Fotos propias de trabajos hechos por Yurany** — confirmadas como existentes y utilizables, pero todavía **no están en el repositorio**: `public/` solo contiene el logo y los SVG que dejó `create-next-app`.
- Catálogo real de 10 servicios con precios y duraciones (`supabase/migrations/004_seed.sql`).
- Horario real de atención (`supabase/migrations/005_business_hours.sql`).

**No existe — no inventar:** testimonios, reseñas, calificaciones, cantidad de clientas atendidas, años de experiencia, certificaciones, premios, marcas de productos, métricas de resultados y dirección publicada (existe, pero no está confirmada por escrito en este repositorio).

**Relleno actual que no es evidencia:** las cifras del landing ("6+ tipos de servicio", "100% materiales premium") y la lista de características ("materiales de alta calidad", "ambiente íntimo y personalizado") son texto de relleno, no afirmaciones verificadas. No deben tratarse como hechos confirmados ni ampliarse.

## Product Principles

1. **Reservar sin conversar.** La razón de existir del producto es cerrar una cita sin esperar respuesta de nadie. Cualquier paso que obligue a contactar a Yurany para completar una reserva le quita el sentido.
2. **La disponibilidad nunca miente.** Una hora ofrecida es una hora que existe: se valida en el servidor contra el horario real y la duración del servicio, y la base rechaza los solapamientos. Es preferible mostrar menos horas que mostrar una que después falle.
3. **Una sola profesional, un solo calendario.** Nada se diseña ni se modela como si hubiera equipo, sucursales o recursos en paralelo.
4. **El panel se usa de pie y con una mano.** Yurany lo abre entre clientas, casi siempre desde el teléfono. Lo operativo tiene que resolverse en pocos toques y sin lectura fina.
5. **Nada inventado sobre el negocio.** Sin testimonios, cifras, credenciales ni promesas que Yurany no haya confirmado. Cuando falte contenido real, se pide — no se rellena.
