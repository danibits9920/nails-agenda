-- ─────────────────────────────────────────────────────────────────
-- 005_business_hours.sql  —  Horario de atención configurable
-- ─────────────────────────────────────────────────────────────────

-- Tabla de horarios por día de semana
create table if not exists business_hours (
  id          uuid    primary key default gen_random_uuid(),
  day_of_week int     not null unique check (day_of_week between 0 and 6),
  -- 0 = Domingo … 6 = Sábado (convención JS/PostgreSQL extract(dow))
  start_time  time    not null default '09:00',
  end_time    time    not null default '19:00',
  is_active   boolean not null default true,
  constraint business_hours_time_check check (end_time > start_time)
);

-- RLS
alter table business_hours enable row level security;

create policy "business_hours_anon_select"
  on business_hours for select to anon
  using (true);

create policy "business_hours_admin_all"
  on business_hours for all to authenticated
  using (true) with check (true);

-- Seed: Lunes–Sábado activo, Domingo libre
insert into business_hours (day_of_week, start_time, end_time, is_active) values
  (0, '09:00', '19:00', false),  -- Domingo
  (1, '09:00', '19:00', true),   -- Lunes
  (2, '09:00', '19:00', true),   -- Martes
  (3, '09:00', '19:00', true),   -- Miércoles
  (4, '09:00', '19:00', true),   -- Jueves
  (5, '09:00', '19:00', true),   -- Viernes
  (6, '09:00', '15:00', true)    -- Sábado (horario reducido)
on conflict (day_of_week) do nothing;

-- ── Actualizar get_available_slots para leer business_hours ────────
create or replace function get_available_slots(
  p_date          date,
  p_duration_mins int
)
returns table (slot_start time, slot_end time)
language sql
security definer
as $$
  with
  -- Horario configurado para el día solicitado
  bh as (
    select start_time, end_time
    from business_hours
    where day_of_week = extract(dow from p_date)::int
      and is_active = true
    limit 1
  ),
  -- Genera todos los slots posibles del día (cada 30 min)
  all_slots as (
    select
      (bh.start_time + (n * interval '30 minutes'))::time        as slot_start,
      (bh.start_time + (n * interval '30 minutes')
        + (p_duration_mins * interval '1 minute'))::time         as slot_end
    from bh, generate_series(0, 47) n   -- máximo 47 medias horas = 23:30
    where
      (bh.start_time + (n * interval '30 minutes')) < bh.end_time
      and
      (bh.start_time + (n * interval '30 minutes')
        + (p_duration_mins * interval '1 minute')) <= bh.end_time
  ),
  -- Citas activas ese día
  booked as (
    select start_time, end_time
    from appointments
    where date = p_date
      and status not in ('cancelled', 'no_show')
  )
  -- Slots sin solapamiento
  select s.slot_start, s.slot_end
  from all_slots s
  where not exists (
    select 1 from booked b
    where s.slot_start < b.end_time
      and s.slot_end   > b.start_time
  )
  order by s.slot_start;
$$;

grant execute on function get_available_slots(date, int) to anon;
