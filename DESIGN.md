---
name: Nails Art Yurany
description: Papel crema y tinta de medianoche — la agenda de una manicurista, donde lo suave invita y lo oscuro confirma.
colors:
  tinta-medianoche: "#1A2040"
  tinta-clara: "#2A3360"
  tinta-secundaria: "#4A5270"
  tinta-terciaria: "#5C627D"
  tinta-tenue: "#6A728E"
  rosa-empolvado: "#EDAAB5"
  rosa-claro: "#F5C0C0"
  rosa-profundo: "#D98898"
  lila-nacarado: "#D4BCEC"
  lila-profundo: "#B89ED6"
  oro-viejo: "#D4AF37"
  oro-profundo: "#836200"
  papel-crema: "#FFF8F8"
  blanco: "#FFFFFF"
  crema-elevada: "#FEF5F7"
  crema-contenedor: "#FDF0F3"
  crema-contenedor-alta: "#FCEAED"
  crema-contenedor-maxima: "#F9E1E5"
  borde: "rgba(26,32,64,0.10)"
  borde-suave: "rgba(26,32,64,0.06)"
  borde-fuerte: "rgba(26,32,64,0.20)"
  exito: "#81C784"
  exito-solido: "#529F58"
  pista-apagada: "#DCDEE5"
  pista-borde: "#91949E"
  advertencia: "#FFB74D"
  error: "#E57373"
  info: "#64B5F6"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  page:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.5rem, 1.15rem + 1.6vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  section:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  metric:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + 0.9vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  meta:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.2em"
  micro:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
rounded:
  xs: "4px"
  sm: "9.6px"
  md: "12.8px"
  lg: "16px"
  xl: "22.4px"
  2xl: "28.8px"
  3xl: "35.2px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  gutter: "20px"
  lg: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.tinta-medianoche}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.tinta-clara}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-secondary:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta-medianoche}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-disabled:
    backgroundColor: "{colors.tinta-tenue}"
    textColor: "{colors.tinta-terciaria}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  card-surface:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta-medianoche}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  card-option-selected:
    backgroundColor: "{colors.rosa-claro}"
    textColor: "{colors.tinta-medianoche}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  chip-slot:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta-medianoche}"
    rounded: "{rounded.xl}"
    padding: "12px 8px"
  badge-eyebrow:
    backgroundColor: "{colors.crema-elevada}"
    textColor: "{colors.rosa-profundo}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    typography: "{typography.label}"
  input-field:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta-medianoche}"
    rounded: "{rounded.lg}"
    height: "44px"
    padding: "0 12px"
  nav-item-active:
    backgroundColor: "{colors.crema-elevada}"
    textColor: "{colors.tinta-medianoche}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
---

# Design System: Nails Art Yurany

## Overview

**Creative North Star: "El Esmalte y la Tinta"**

Dos materiales gobiernan este sistema y no se mezclan. El **esmalte** —rosa empolvado, lila nacarado, oro viejo— es la identidad: aparece en gradientes, halos difusos, etiquetas diminutas, estados seleccionados y la marca misma. Seduce, pero nunca decide. La **tinta** —un navy casi negro, sólido, sin gradiente— es la autoridad: cada botón que confirma algo, cada título, cada dato que importa. Lo suave invita; lo oscuro confirma. Cuando dudes sobre qué color usar, pregunta si el elemento decide algo. Si decide, es tinta.

El carácter es **elegante, preciso y contenido**. Elegante por el emparejamiento editorial de Playfair Display con Inter y por la generosidad del aire entre secciones. Preciso porque cada dato que la clienta necesita leer sin equivocarse —el precio, la hora, la duración— está compuesto en el alfabeto más neutro disponible y separado del adorno. Contenido porque los materiales más llamativos están racionados: el oro toca únicamente el dinero, el rosa nunca ocupa una superficie grande a plena saturación, y la profundidad solo aparece cuando alguien interactúa.

El sistema se define **contra el dashboard corporativo frío**: grises azulados, densidad de datos, cero calidez. Ese es el riesgo real del panel de administración si alguna vez se optimiza solo por eficiencia. Yurany trabaja en un espacio íntimo y su herramienta debe seguir sintiéndose parte de ese espacio, no de una oficina. La calidez no es decoración negociable: es el papel crema bajo todo, el borde que nunca es gris sino navy translúcido, y la etiqueta rosada que abre cada sección.

**Key Characteristics:**
- Papel crema (#FFF8F8) bajo absolutamente todo; el blanco puro es una elevación, no el fondo.
- Navy sólido para toda acción; rosa, lila y oro exclusivamente para identidad y estado.
- Playfair Display titula, Inter informa — nunca al revés.
- Etiqueta de sección en versalitas de 11px con tracking 0.2em abriendo cada bloque.
- Píldoras para decidir, rectángulos muy blandos (28.8px) para contener.
- Plano en reposo; la sombra y el desplazamiento son respuesta al toque.
- Sin modo oscuro: `color-scheme` está fijo en claro y la marca es luminosa por definición.

## Colors

Una paleta de esmaltes sobre papel: cinco familias cálidas y luminosas ancladas por una única tinta profunda que carga todo el peso de la acción.

### Primary
- **Tinta de Medianoche** (#1A2040): el color de la decisión. Todo botón que confirma, avanza o envía; todos los títulos; el texto de lectura principal; la barra superior del panel en móvil; el día seleccionado del calendario. Se aplica sólido, jamás en gradiente.
- **Tinta Clara** (#2A3360): el único estado hover del primario. No se usa en reposo ni como color de texto.

### Secondary
- **Rosa Empolvado** (#EDAAB5): la marca. Vive en el círculo degradado del logotipo, el halo del paso completado, el punto que precede cada título de categoría, los bordes de estado seleccionado y el color de selección de texto. **Nunca es el fondo de un botón.**
- **Rosa Claro** (#F5C0C0): el extremo suave del gradiente de marca y los lavados de fondo al 15–25% de opacidad detrás de opciones seleccionadas.
- **Rosa Profundo** (#D98898): el rosa legible. Toda etiqueta en versalitas, todo enlace secundario, todo ícono de acento sobre superficie clara. Es el único rosa que se aplica a texto.

### Tertiary
- **Lila Nacarado** (#D4BCEC): el segundo polo del gradiente de marca y las manchas atmosféricas del hero. Nunca aparece sola sobre texto.
- **Lila Profundo** (#B89ED6): acento de datos en el panel — íconos de métricas y cifras secundarias.
- **Oro Viejo** (#D4AF37) y **Oro Profundo** (#836200): el material más racionado del sistema. Oro Profundo compone el precio; Oro Viejo aparece únicamente como destello decorativo puntual y nunca lleva texto ni marca un estado.

### Neutral
- **Papel Crema** (#FFF8F8): el fondo de todo el producto, público y privado. No es blanco: es papel tibio con una gota de rosa.
- **Blanco** (#FFFFFF): superficie elevada. Tarjetas, campos de formulario, barras fijas. El blanco significa "esto está por encima del papel".
- **Crema Elevada** (#FEF5F7) → **Crema Contenedor** (#FDF0F3) → **Crema Alta** (#FCEAED) → **Crema Máxima** (#F9E1E5): rampa tonal de contenedores. Cada escalón agrega presencia sin agregar sombra.
- **Tinta Secundaria** (#4A5270): párrafos y texto de apoyo. Es el color de lectura más frecuente después del navy.
- **Tinta Terciaria** (#5C627D) y **Tinta Tenue** (#6A728E): metadatos, marcas de tiempo, texto deshabilitado. La escala de tinta tiene tres escalones medidos sobre papel crema — Secundaria 7.33:1, Terciaria 5.73:1, Tenue 4.54:1 — y el último todavía pasa AA: ningún nivel de la jerarquía es ilegible.
- **Bordes** (`rgba(26,32,64,0.06)` suave / `0.10` estándar / `0.20` fuerte): siempre navy translúcido, nunca gris. Es lo que mantiene cálida la retícula.

### Named Rules

**La Regla del Esmalte y la Tinta.** El rosa nunca confirma; la tinta nunca decora. Ningún botón de acción lleva fondo rosado y ningún gradiente lleva navy. Test: si un elemento cambia el estado de una reserva y no es navy sólido, está mal.

**La Regla del Oro.** Oro Profundo (#836200) toca únicamente el dinero. En el flujo público esto se cumple sin excepción: los cinco lugares donde aparece un precio son dorados y no hay un sexto uso. Si el oro aparece en algo que no es una cifra en pesos, sobra.

**La Regla de la Tabla Única.** El estado de una cita se pinta desde `--color-status-*` y desde ningún otro lugar. Cada estado tiene exactamente tres roles: `-bg` rellena, `-text` escribe encima (≥6:1 sobre su propio relleno), `-accent` marca puntos, barras y bordes (≥3:1 sobre blanco y sobre crema). Un componente que define su propia tabla de estado está roto, aunque se vea bien: hubo cuatro tablas conviviendo y una cita "Confirmada" era violeta, lila o azul según la pantalla.

**La Regla del Token Único.** Todo color entra por una variable `--color-*`. La paleta cruda de Tailwind (`amber-100`, `emerald-500`, `gray-200`) está prohibida: duplica el sistema con valores que nadie puede cambiar desde un solo lugar.

## Typography

**Display Font:** Playfair Display (con Georgia, serif como respaldo)
**Body Font:** Inter (con system-ui, sans-serif como respaldo)

**Character:** Un serif de alto contraste y ejes verticales frente a un grotesco neutro de aperturas amplias. Playfair aporta la ceremonia —la sensación de catálogo, de nombre propio, de algo cuidado— e Inter aporta la neutralidad que un dato necesita para no ser confundido. La tensión entre ambos es la misma del North Star: uno es el esmalte, el otro es la tinta.

### Hierarchy

Cinco de estos roles existen como tokens `--text-*` y se aplican con una sola clase (`text-page`, `text-metric`, `text-section`, `text-eyebrow`, `text-micro`): cada uno trae su tamaño, su interlineado, su tracking y su peso juntos. Los otros dos —cuerpo y metadato— son tamaños a secas y usan la clase de Tailwind que les corresponde.

Esa es la regla de reparto: **un rol con nombre existe cuando el tratamiento es compuesto.** Si sólo cambia el tamaño, no hace falta bautizarlo.

- **Display** (Playfair 700, `clamp(2.25rem, 5vw, 3.75rem)`, 1.1): el título del hero público. Uno por página.
- **Page** — `text-page` (Playfair 700, `clamp(1.5rem, 1.15rem + 1.6vw, 2.25rem)`, 1.1): el título de cualquier página del producto. Es fluido en lugar de dar un salto en `md`, porque los saltos por punto de quiebre fue justo como llegaron a convivir cinco tratamientos distintos del mismo título.
- **Headline** (Playfair 700, 1.875rem, 1.2): encabezado de sección del sitio público, siempre precedido por su versalita.
- **Section** — `text-section` (Playfair 700, 1.125rem, 1.3): título de tarjeta y de bloque dentro de una página.
- **Metric** — `text-metric` (Inter 700, `clamp(1.5rem, 1.3rem + 0.9vw, 1.875rem)`, 1.15): la cifra de una métrica. Siempre con `tabular-nums`.
- **Body** — `text-sm` (Inter 400, 0.875rem, 1.6): la lectura por defecto. Los párrafos se limitan a ~45ch.
- **Meta** — `text-xs` (Inter 500, 0.75rem): hora, fecha, contador, texto de apoyo.
- **Eyebrow** — `text-eyebrow` (Inter 700, 0.6875rem, tracking 0.2em, versalitas): la etiqueta que abre cada bloque, en Rosa Profundo.
- **Micro** — `text-micro` (Inter 600, 0.625rem, tracking 0.04em): el escalón más pequeño del sistema. Etiqueta de navegación, cabecera de día, riel de horas. Por debajo de esto no hay nada.

### Named Rules

**La Regla del Rol Único.** Un texto se compone eligiendo su trabajo, no su tamaño. Escribir `text-2xl md:text-4xl font-bold tracking-tight` en un título es cómo el panel acabó con cinco tratamientos del mismo `<h1>`, tres trackings para una misma versalita y tres clases de tamaño que ni siquiera existían — `text-4.5xl`, `text-2.5xl` y `text-3.5xl` no generaban ninguna regla, así que esos títulos renderizaban al tamaño del cuerpo. Test: si una clase de tamaño va acompañada de peso y tracking escritos a mano, falta un rol.

**La Regla del Suelo Micro.** El escalón más pequeño del sistema es `text-micro` (10px). Convivían un tier de 9px y otro de 10px separados por un píxel haciendo el mismo trabajo; ahora es uno solo. Nada se compone por debajo.

**La Regla de la Cifra Tabular.** Todo número que se lee en columna —precio, hora, día del calendario, métrica— lleva `tabular-nums`. Sin eso un 1 ocupa menos que un 8 y las columnas bailan de fila en fila.

**La Regla de los Dos Alfabetos.** Playfair titula; Inter informa. Ningún dato que la clienta deba leer con precisión —precio, hora, fecha, duración— se compone en Playfair. Un número que se puede leer mal es un número mal compuesto.

**La Regla de la Versalita.** Ninguna sección empieza directamente con su título. Antes va la etiqueta de 11px en versalitas con tracking 0.2em en Rosa Profundo ("CATÁLOGO", "SOBRE MÍ", "PROCESO SENCILLO"). Es el gesto editorial que sostiene todo el ritmo de página.

**La Regla del Tracking Negativo.** Todo Playfair lleva `tracking-tight` (-0.025em). El serif a tamaño grande abre demasiado por defecto; cerrarlo es lo que lo hace ver compuesto y no escrito.

## Layout

**Contenedores.** El sitio público se centra en 1024px (`max-w-5xl`); el flujo de reserva se estrecha a 672px (`max-w-2xl`) para que la decisión ocupe una sola columna sin distracción. El panel de administración no tiene contenedor: usa el ancho disponible con 32px de padding interior. La canaleta lateral es 20px en todos los anchos y nunca cambia — es la constante que mantiene el producto reconocible entre el móvil y el escritorio.

**Ritmo vertical.** Las secciones del landing respiran a 64px (`py-16`), y las bandas alternan fondo para marcar el compás: crema → blanco → crema → crema elevada → crema. El cambio de fondo, no una línea divisoria, es lo que separa una sección de la siguiente.

**Retículas.** Servicios: 1 columna en móvil, 2 en `sm`, 3 en `lg`. Horarios disponibles: 3 columnas en móvil, 4 desde `sm`. Métricas del panel: 2 columnas, 4 desde `xl`. Los pasos del proceso pasan de apilados a 4 columnas en `sm`, con una línea conectora que solo existe en el ancho horizontal.

**El punto de quiebre que importa es `md` (768px).** Ahí el panel cambia de arquitectura completa: barra lateral fija de 240px y sin navegación inferior por encima; barra superior navy y navegación inferior de cinco destinos por debajo. No es una adaptación del mismo layout, son dos layouts.

**Elementos fijos.** La navegación pública se ancla arriba (`z-50`) con desenfoque de fondo; el encabezado de pasos hace lo mismo (`z-40`); el botón de continuar en la selección de servicio se ancla abajo sobre un degradado de papel crema que se desvanece hacia transparente. En móvil el contenido del panel reserva 80px inferiores para no quedar bajo la navegación.

## Elevation & Depth

El sistema es **plano en reposo y se levanta al tocar**. Las superficies descansan sobre el papel crema con una sombra apenas perceptible (alfa 0.04–0.06) o sin ninguna, y la profundidad real aparece como respuesta: la tarjeta sube 2px, el horario crece un 5%, el botón sube y su sombra se agranda. Al soltar, todo vuelve. La atmósfera del hero se construye aparte, con manchas de gradiente de 500px desenfocadas a `blur-3xl` y opacidad 15–25% — luz, no objetos.

Sobre esa base opera una segunda mecánica: la **rampa tonal de crema**. Un contenedor puede ganar presencia subiendo de escalón (papel → crema elevada → crema contenedor) sin recibir sombra alguna. Se prefiere el tono cuando el elemento está en reposo y la sombra cuando responde a una acción.

### Shadow Vocabulary
- **Card** (`0 1px 2px rgba(26,32,64,0.06), 0 1px 3px rgba(26,32,64,0.04)`): reposo de tarjetas y contenedores. Es una insinuación de separación, no una elevación.
- **Raised** (`0 2px 6px rgba(26,32,64,0.08), 0 1px 2px rgba(26,32,64,0.06)`): hover de tarjeta y superficies destacadas del flujo de reserva.
- **Overlay** (`0 8px 24px rgba(26,32,64,0.10), 0 2px 6px rgba(26,32,64,0.06)`): modales y elementos que flotan sobre el contenido.

Toda sombra es navy translúcido. No existe una sombra negra en el sistema.

### Named Rules

**La Regla del Reposo Plano.** Las superficies descansan planas o casi planas. Si un elemento tiene sombra visible sin que nadie lo esté tocando, o está mal, o es un overlay.

**La Regla del Anillo de Foco.** El estado activo se marca con un anillo translúcido del propio color (`ring-4 ring-[color]/10`) más un `scale-110`, nunca con un borde grueso opaco. Se usa en el paso actual del stepper y en el día seleccionado del calendario.

## Shapes

El lenguaje de forma es deliberadamente blando: no existe una esquina viva en todo el producto. La escala efectiva de radios —tras la composición de las variables de tema— es 4px, 9.6px, 12.8px, 16px, 22.4px, **28.8px**, 35.2px y píldora. Los dos escalones que definen el aspecto son 28.8px (`rounded-2xl`, toda tarjeta de contenido y toda opción seleccionable) y 35.2px (`rounded-3xl`, los bloques ceremoniales: el CTA final y la tarjeta de confirmación).

Los bordes son de un solo cabello, siempre navy translúcido, y suben de opacidad solo para señalar interacción posible (0.06 decorativo → 0.10 estándar → 0.20 accionable). La marca es el logotipo real: un medallón circular con aro dorado, relleno degradado de melocotón a lavanda y el nombre en script navy sobre una pincelada de oro (`public/logo-yurany.png`). Es opaco, así que se apoya sobre cualquier superficie —incluida la barra navy del móvil— sin contorno ni relleno propio. Aparece a 28, 30 y 36px en navegación y a 112px en el acceso al panel.

### Named Rules

**La Regla de la Píldora.** Todo lo que decide es una píldora (`rounded-full`): botones de acción, etiquetas de estado, chips de confianza, botones de navegación. Todo lo que contiene es un rectángulo muy blando. Un elemento dentro de una retícula densa —el horario disponible— es la única excepción: mantiene 22.4px para que la fila lea como fila.

**La Regla del Círculo.** Lo que representa a una persona, un paso o un día es un círculo perfecto: la marca, el número de paso, la casilla del calendario, el avatar, el radio de selección. Nunca un cuadrado redondeado.

**La Regla del Medallón.** La marca se pinta desde `BrandMark` y desde ningún otro lugar; nadie vuelve a dibujarla con un degradado y un icono. Por debajo de 28px el medallón funciona como firma de color, no como nombre legible, así que en navegación va siempre acompañado del nombre en texto — que es el par marca + logotipo, no una repetición. El círculo degradado sigue siendo válido para lo que **no** es la marca: el avatar de una clienta lleva su inicial sobre ese degradado.

## Components

### Buttons
- **Shape:** píldora completa (`rounded-full`), sin excepción en acciones primarias.
- **Primary:** fondo Tinta de Medianoche, texto blanco, 14px verticales por 32px horizontales, peso 600 a 15px, sombra media. Es el único botón que confirma.
- **Hover / Focus:** fondo a Tinta Clara, desplazamiento de -2px, sombra a `lg`, transición `all`. Al presionar vuelve a 0. Algunas variantes usan `scale-105 / active:scale-95` en lugar del desplazamiento; ambos gestos son válidos, pero uno solo por botón.
- **Secondary:** fondo blanco al 70% con desenfoque, texto navy, borde `borde-fuerte`; en hover el borde pasa a navy sólido y el fondo a blanco puro.
- **Disabled:** fondo Tinta Tenue al 40%, texto Tinta Terciaria, cursor bloqueado, sin sombra ni movimiento. El estado deshabilitado explica por qué lo está en su propia etiqueta ("Selecciona un servicio para continuar"), no solo se apaga.
- **Enlace de texto:** peso 700 en Rosa Profundo con un chevron que se desplaza 2px en hover.

### Chips
- **Horario disponible:** superficie blanca, borde estándar, 22.4px de radio, hora en peso 700 formato 12h. En hover el borde pasa a Rosa Empolvado, el fondo a un lavado rosa al 15% y el chip crece 5%.
- **Etiqueta de confianza:** píldora blanca al 80% con desenfoque, ícono de 12px en Rosa Profundo, texto de 12px peso 600.
- **Etiqueta de estado:** píldora de 2px por 10px, 12px peso 500, con relleno, texto y borde tomados de la tabla única. Los seis estados, en tríos `bg / text / accent`: Pendiente `#FFEEC7 / #775300 / #B38910`, Confirmada `#F5E5FF / #6E4397 / #A97AD9`, En curso `#FFE1E7 / #8A3B4E / #D47287`, Completada `#D9F8DC / #266632 / #589F62`, Cancelada `#FFE3E2 / #903B3E / #DB6F71`, No asistió `#EAECF5 / #525769 / #898FA6`. Los estados de pago reutilizan estos mismos tríos: Por verificar toma Pendiente, Pagado toma Completada, Sin pagar toma Cancelada. "En curso" es el rosa de la marca porque es el estado que está pasando ahora; "No asistió" es el neutro, y ese neutro es navy desaturado, nunca gris frío.

### Cards / Containers
- **Corner Style:** 28.8px estándar; 35.2px en bloques ceremoniales.
- **Background:** blanco sobre papel crema. Los bloques destacados usan un gradiente diagonal de rosa 20% a blanco a lila 15%.
- **Shadow Strategy:** `shadow-card` en reposo, `shadow-raised` en hover, según La Regla del Reposo Plano.
- **Border:** un cabello de `borde`; pasa a Rosa Empolvado cuando la tarjeta es accionable y recibe el cursor.
- **Internal Padding:** 20px estándar, 24px en tarjetas de resumen, 32px en bloques ceremoniales.

### Inputs / Fields
- **Style:** fondo blanco sobre el papel crema, 16px de radio, 44px de alto, borde de un cabello. La etiqueta va encima en peso 600 sobre Tinta Secundaria, con el asterisco de requerido en color de error.
- **Focus:** el borde toma el color de anillo y aparece un halo de 3px al 50%. Nunca se elimina el indicador de foco.
- **Error:** mensaje sobre fondo `error-bg` (#FFF1F1) con borde del color de error al 20%, en 14px, dentro de un rectángulo de 16px de radio. El texto explica qué hacer, no solo qué falló.
- **Selección de opción:** la opción es una tarjeta completa clicable con radio circular a la izquierda; seleccionada toma borde Rosa Empolvado, fondo rosa al 15% y sombra de tarjeta.

### Interruptores
- **Encendido:** relleno sólido del significado, no del adorno — verde afirmativo (#529F58) para "servicio activo", acento de Pendiente para "modo mantenimiento", porque una pausa no es un éxito. El oro no enciende nada.
- **Apagado:** relleno `#DCDEE5` con borde propio `#91949E`. El borde no es decorativo: un relleno claro sin él no alcanza 3:1 contra la tarjeta blanca y el control desaparece.
- **Pulgar:** círculo blanco de 2–3px de margen que se desplaza; la transición es de 200ms sobre color y posición.

### Navigation
- **Escritorio (panel):** barra lateral de 240px sobre papel crema, ítems de 14px peso 500 con un borde izquierdo de 3px transparente que se vuelve Rosa Empolvado al activarse, fondo Crema Elevada y el ícono en Rosa Profundo. Cerrar sesión vive separado abajo y solo se tiñe de error al recibir el cursor.
- **Móvil (panel):** barra superior navy sólido con la marca y el monograma, más navegación inferior fija de cinco destinos sobre blanco al 95% con desenfoque; el destino activo pinta una cápsula rosa al 40% tras el ícono, engrosa el trazo a 2.2 y colorea la etiqueta de 9px.
- **Público:** barra superior fija sobre papel crema al 90% con desenfoque, marca a la izquierda y un único botón navy a la derecha. Solo hay un enlace de texto acompañante y desaparece bajo `sm`.

### Signature Component — Encabezado de pasos

El componente que define el flujo de reserva. Cuatro círculos de 32px conectados por segmentos de 2px, sobre blanco al 95% con desenfoque, fijo arriba. Un paso completado es Rosa Empolvado con un check blanco y su conector rosa; el paso actual es Tinta de Medianoche con anillo translúcido de 4px y `scale-110`; un paso pendiente es papel crema con borde y texto tenue. Bajo cada círculo va su nombre en 10px peso 600. La progresión completa el relato del North Star en un solo objeto: lo hecho se vuelve esmalte, lo presente es tinta.

### Signature Component — Calendario de reserva

Retícula de siete columnas con casillas circulares de 36px. El día seleccionado es navy con anillo translúcido y `scale-110`; hoy sin seleccionar lleva un borde de 2px en Rosa Profundo; un día pasado baja a 35% de opacidad y pierde el cursor. Los encabezados de día son de 10px peso 700 en Tinta Tenue. El mes se anuncia en Playfair con `aria-live` para que el cambio se escuche además de verse.

## Do's and Don'ts

### Do:
- **Do** usar Tinta de Medianoche sólido para cualquier control que confirme, avance o envíe. Es el único color de acción del sistema.
- **Do** abrir cada sección con la etiqueta de 11px en versalitas y tracking 0.2em sobre Rosa Profundo antes del título.
- **Do** componer todo dato preciso —precio, hora, fecha, duración— en Inter, y todo título en Playfair.
- **Do** elegir el rol (`text-page`, `text-section`, `text-eyebrow`, `text-micro`, `text-metric`) y dejar que él ponga el peso y el tracking.
- **Do** dejar las superficies planas en reposo y reservar sombra y desplazamiento para la respuesta al toque.
- **Do** declarar todo color a través de una variable `--color-*` de `globals.css`.
- **Do** usar `BrandMark` para la marca, en cualquier tamaño y sobre cualquier fondo.
- **Do** apoyar el papel crema (#FFF8F8) como fondo y tratar el blanco puro como una elevación deliberada.
- **Do** subir un escalón en la rampa de crema cuando un contenedor necesite presencia sin sombra.
- **Do** mantener la canaleta de 20px en todos los anchos.
- **Do** conservar el indicador de foco visible en todo control interactivo; el sistema ya usa anillo translúcido de 3–4px.
- **Do** dar borde propio a todo control de relleno claro (interruptores, pistas): sin él no llega a 3:1 contra la superficie y deja de percibirse.
- **Do** describir el estado deshabilitado con palabras, no solo bajando la opacidad.

### Don't:
- **Don't** usar rosa, lila u oro como fondo de un botón de acción. El esmalte no confirma.
- **Don't** aplicar Oro Profundo a nada que no sea una cifra en pesos.
- **Don't** introducir colores de la paleta cruda de Tailwind (`amber-100`, `emerald-500`, `gray-200`, `red-50`). Todo color pasa por un token.
- **Don't** componer números que la clienta deba leer con exactitud en Playfair Display.
- **Don't** repetir peso o tracking junto a una clase de rol: el rol ya los trae y duplicarlos es como aparecieron tres versiones de la misma versalita.
- **Don't** usar esquinas vivas: el radio mínimo de un contenedor es 22.4px y el de una tarjeta 28.8px.
- **Don't** pintar bordes ni sombras grises; ambos son navy translúcido.
- **Don't** pintar un estado de cita con un color escrito a mano: si no sale de `--color-status-*`, no existe.
- **Don't** construir un tema oscuro parcial: `color-scheme` está fijo en claro y las variantes `dark:` que traen los componentes de base no tienen contraparte de marca.
- **Don't** combinar `-translate-y` y `scale` en el mismo elemento; un botón elige un solo gesto de respuesta.
- **Don't** enfriar el panel de administración hacia grises azulados y densidad de datos: es la anti-referencia confirmada del proyecto.
