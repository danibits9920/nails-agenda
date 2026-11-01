# Migración a la cuenta nueva de Supabase

> **Estado (2026-11-01): migración suspendida.** El proyecto viejo (`ufmffyytvjrpibbkjdjn`) se
> reactivó con todos sus datos y la app volvió a usarlo. El proyecto nuevo no respondía.
> Las claves del nuevo quedaron comentadas en `.env.local` como `NEW_*`. Para que no se vuelva a
> pausar, `.github/workflows/keep-supabase-awake.yml` consulta la base cada lunes.


Proyecto destino: **`ulbgbdoykfkkdfcjiles`** → `https://ulbgbdoykfkkdfcjiles.supabase.co`

## Por qué se migró

El proyecto anterior (`ufmffyytvjrpibbkjdjn`, *nails-art-yurany*, sa-east-1) quedó en
estado `INACTIVE`. No fue por consumo de datos: la cuenta llegó al **límite de 2
proyectos free**, y Supabase rechaza el restore mientras no se libere un cupo.

## Pasos

### 1. Crear el schema

Dashboard → **SQL Editor** → New query → pegar completo
[`supabase/setup_completo.sql`](supabase/setup_completo.sql) → **Run**.

Es el consolidado de las migraciones 001–011 e **idempotente**: correrlo dos veces no
duplica datos ni falla. Al final imprime una tabla de verificación; debe dar:

| chequeo | valor esperado |
|---|---|
| tablas | 9 |
| políticas | 19 |
| servicios | 10 |
| horarios | 7 |
| categorías | 6 |
| bucket | `service-images` |
| anti-overlap | `OK` |
| slots_60min | > 0 |

### 2. Crear el usuario admin

Dashboard → **Authentication → Users → Add user**:

- Email + contraseña (los que uses para entrar al panel)
- Marcar **Auto Confirm User** — si no, el login falla con "Email not confirmed"

El panel no distingue roles: **cualquier usuario autenticado es admin** (las políticas
RLS dan acceso total a `authenticated`). No crees usuarios extra.

### 3. Copiar las claves

Dashboard → **Settings → API Keys**. Rellenar en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # anon / publishable
SUPABASE_SERVICE_ROLE_KEY=...       # service_role / secret — nunca al cliente
```

La URL ya quedó puesta. Los valores del proyecto viejo quedaron comentados abajo como
`OLD_*` por si hay que exportar datos.

> Si el proyecto nuevo usa el formato nuevo de claves (`sb_publishable_…` /
> `sb_secret_…`), sirven igual: `@supabase/ssr` y `supabase-js` las aceptan sin cambios
> de código.

### 4. Verificar

```bash
npm run dev
```

- `/` → deben verse los 10 servicios del catálogo
- `/reservar` → el paso de horario debe mostrar slots (usa el RPC `get_available_slots`)
- `/<ADMIN_PATH>` → login con el usuario del paso 2
- Admin → Servicios → subir una imagen (prueba el bucket `service-images`)

### 5. Producción

Si está desplegado en Vercel, actualizar las mismas 3 variables en
**Project Settings → Environment Variables** y redesplegar. El build cachea las
`NEXT_PUBLIC_*`, así que no basta con reiniciar.

## Qué NO se migra automáticamente

- **Datos reales** (citas, clientes, pagos) del proyecto viejo. Mientras siga pausado se
  puede bajar el backup desde su dashboard. Si se elimina, se pierden.
- **Imágenes** del bucket `service-images` — hay que volver a subirlas.
- **Usuarios de Auth** — se recrean a mano (paso 2).

## Evitar que se vuelva a pausar

Supabase pausa proyectos free tras **7 días sin actividad**. Si la agenda pasa temporadas
sin tráfico, conviene un ping semanal (cron de GitHub Actions o similar) contra cualquier
endpoint público que toque la base.

## MCP

`.mcp.json` ya apunta al proyecto nuevo. Requiere autorización OAuth una sola vez:
ejecutar `/mcp` en una sesión interactiva de Claude Code y aprobar el servidor `supabase`.
