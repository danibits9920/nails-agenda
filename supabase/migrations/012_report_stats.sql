-- ─────────────────────────────────────────────────────────────────
-- 012_report_stats.sql  —  Reportes en una sola consulta
--
-- La página de reportes hacía seis consultas para producir once números,
-- y dos de ellas eran un problema:
--
--   1. `select status from appointments` sin límite: traía TODAS las citas
--      que existen para contarlas por estado en JavaScript. A diez citas
--      diarias son ~3.100 filas al año, transferidas enteras en cada carga
--      para calcular seis números.
--
--   2. `select service_id, services(name) ... limit 300` SIN `order by`:
--      el ranking de "servicios más solicitados" se calculaba sobre 300
--      filas arbitrarias. Postgres no garantiza cuáles devuelve sin un
--      orden explícito, así que el ranking no sólo estaba mal pasadas las
--      300 citas: no era determinista.
--
-- Esta función agrega en la base y devuelve un único objeto. Las fechas de
-- corte se calculan en la zona horaria del negocio, no en la del servidor:
-- "ingresos del mes" se cortaba por el mes UTC, que en Chile empieza y
-- termina tres o cuatro horas antes de tiempo.
-- ─────────────────────────────────────────────────────────────────

create or replace function get_report_stats()
returns jsonb
language sql
security definer
set search_path = public
as $$
  with bounds as (
    select
      (date_trunc('month', now() at time zone 'America/Santiago')
        at time zone 'America/Santiago') as mes_inicio,
      (date_trunc('year',  now() at time zone 'America/Santiago')
        at time zone 'America/Santiago') as anio_inicio
  ),
  ingresos as (
    -- Un solo recorrido acotado al año en curso: el filtro del mes se
    -- resuelve con FILTER en vez de con una segunda consulta.
    select
      coalesce(sum(amount) filter (where created_at >= (select mes_inicio from bounds)), 0) as mes,
      coalesce(sum(amount), 0) as anio
    from payments
    where status = 'verified'
      and created_at >= (select anio_inicio from bounds)
  ),
  por_estado as (
    select status, count(*)::int as n
    from appointments
    group by status
  ),
  estados as (
    select
      coalesce(jsonb_object_agg(status, n), '{}'::jsonb) as mapa,
      coalesce(sum(n), 0)::int                           as total,
      coalesce(sum(n) filter (where status = 'no_show'), 0)::int as no_show
    from por_estado
  ),
  top as (
    select coalesce(
      jsonb_agg(jsonb_build_object('name', name, 'count', n) order by n desc, name),
      '[]'::jsonb
    ) as lista
    from (
      -- Ranking sobre todas las citas, con orden explícito, y el límite
      -- aplicado DESPUÉS de agrupar: seis servicios, no seis de 300 filas.
      select s.name, count(*)::int as n
      from appointments a
      join services s on s.id = a.service_id
      where a.status not in ('cancelled', 'no_show')
      group by s.id, s.name
      order by n desc, s.name
      limit 6
    ) t
  )
  select jsonb_build_object(
    'month_revenue',      (select mes     from ingresos),
    'year_revenue',       (select anio    from ingresos),
    'status_counts',      (select mapa    from estados),
    'total_appointments', (select total   from estados),
    'no_show_count',      (select no_show from estados),
    'top_services',       (select lista   from top)
  );
$$;

-- Datos de negocio: sólo la sesión administradora. `security definer`
-- salta RLS, así que el permiso de ejecución es la única puerta.
revoke execute on function get_report_stats() from public, anon;
grant  execute on function get_report_stats() to authenticated;

-- Índices que estas agregaciones aprovechan. `appointments_status_idx` ya
-- existe desde 001; faltaba el de pagos por estado y fecha, que es el que
-- convierte el recorrido de ingresos en un rango sobre índice.
create index if not exists payments_status_created_idx
  on payments (status, created_at desc);

create index if not exists appointments_service_status_idx
  on appointments (service_id, status);
