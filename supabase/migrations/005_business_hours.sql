-- ─────────────────────────────────────────────────────────────────
-- 005_business_hours.sql  —  Horario de atención con dos turnos
-- ─────────────────────────────────────────────────────────────────

create table if not exists business_hours (
  id            uuid    primary key default gen_random_uuid(),
  day_of_week   int     not null unique check (day_of_week between 0 and 6),
  -- Turno 1 (ej: mañana 08:00–12:00)
  start_time_1  time    not null default '08:00',
  end_time_1    time    not null default '12:00',
  -- Turno 2 opcional (ej: tarde 14:00–18:00)
  start_time_2  time    default null,
  end_time_2    time    default null,
  is_active     boolean not null default true,
  constraint bh_shift1_check check (end_time_1 > start_time_1),
  constraint bh_shift2_check check (
    (start_time_2 is null and end_time_2 is null) or
    (start_time_2 is not null and end_time_2 is not null and end_time_2 > start_time_2)
  )
);

alter table business_hours enable row level security;

create policy "business_hours_anon_select"
  on business_hours for select to anon using (true);

create policy "business_hours_admin_all"
  on business_hours for all to authenticated
  using (true) with check (true);

-- Seed: Lun–Vie dos turnos, Sáb solo mañana, Dom libre
insert into business_hours (day_of_week, start_time_1, end_time_1, start_time_2, end_time_2, is_active) values
  (0, '08:00', '12:00', null,    null,    false),  -- Domingo
  (1, '08:00', '12:00', '14:00', '18:00', true),   -- Lunes
  (2, '08:00', '12:00', '14:00', '18:00', true),   -- Martes
  (3, '08:00', '12:00', '14:00', '18:00', true),   -- Miércoles
  (4, '08:00', '12:00', '14:00', '18:00', true),   -- Jueves
  (5, '08:00', '12:00', '14:00', '18:00', true),   -- Viernes
  (6, '08:00', '12:00', null,    null,    true)    -- Sábado (solo mañana)
on conflict (day_of_week) do nothing;

-- ── get_available_slots: genera slots para turno 1 y turno 2 ────────
create or replace function get_available_slots(
  p_date          date,
  p_duration_mins int
)
returns table (slot_start time, slot_end time)
language sql
security definer
as $$
  with
  bh as (
    select start_time_1, end_time_1, start_time_2, end_time_2
    from business_hours
    where day_of_week = extract(dow from p_date)::int
      and is_active = true
    limit 1
  ),
  -- Slots turno 1
  shift1 as (
    select
      (bh.start_time_1 + (n * interval '30 minutes'))::time as slot_start,
      (bh.start_time_1 + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute'))::time as slot_end
    from bh, generate_series(0, 47) n
    where (bh.start_time_1 + (n * interval '30 minutes')) < bh.end_time_1
      and (bh.start_time_1 + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute')) <= bh.end_time_1
  ),
  -- Slots turno 2 (solo si está configurado)
  shift2 as (
    select
      (bh.start_time_2 + (n * interval '30 minutes'))::time as slot_start,
      (bh.start_time_2 + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute'))::time as slot_end
    from bh, generate_series(0, 47) n
    where bh.start_time_2 is not null
      and (bh.start_time_2 + (n * interval '30 minutes')) < bh.end_time_2
      and (bh.start_time_2 + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute')) <= bh.end_time_2
  ),
  all_slots as (
    select * from shift1
    union all
    select * from shift2
  ),
  booked as (
    select start_time, end_time from appointments
    where date = p_date
      and status not in ('cancelled', 'no_show')
  )
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
