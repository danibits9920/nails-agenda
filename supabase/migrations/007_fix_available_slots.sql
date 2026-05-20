-- ── 007_fix_available_slots.sql ──────────────────────────────────────────────
-- Corrige get_available_slots para leer business_hours en vez de usar
-- horario fijo 09:00–19:00. Soporta dos turnos por día.

create or replace function get_available_slots(
  p_date           date,
  p_duration_mins  int
)
returns table (slot_start time, slot_end time)
language sql
security definer
as $$
  with
  -- Horario configurado para el día de la semana de la fecha pedida
  bh as (
    select start_time_1, end_time_1, start_time_2, end_time_2, is_active
    from   business_hours
    where  day_of_week = extract(dow from p_date)::int
  ),

  -- Slots del turno 1
  shift1 as (
    select
      (bh.start_time_1 + (n * interval '30 minutes'))::time as slot_start,
      (bh.start_time_1 + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute'))::time as slot_end
    from   bh, generate_series(0, 47) n
    where  bh.is_active = true
      and  (bh.start_time_1 + (n * interval '30 minutes')) < bh.end_time_1
      and  (bh.start_time_1 + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute')) <= bh.end_time_1
  ),

  -- Slots del turno 2 (solo si está configurado)
  shift2 as (
    select
      (bh.start_time_2 + (n * interval '30 minutes'))::time as slot_start,
      (bh.start_time_2 + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute'))::time as slot_end
    from   bh, generate_series(0, 47) n
    where  bh.is_active     = true
      and  bh.start_time_2 is not null
      and  bh.end_time_2   is not null
      and  (bh.start_time_2 + (n * interval '30 minutes')) < bh.end_time_2
      and  (bh.start_time_2 + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute')) <= bh.end_time_2
  ),

  -- Todos los slots posibles del día (ambos turnos)
  all_slots as (
    select slot_start, slot_end from shift1
    union all
    select slot_start, slot_end from shift2
  ),

  -- Citas existentes que bloquean slots (excluye canceladas y no_show)
  booked as (
    select start_time, end_time
    from   appointments
    where  date   = p_date
      and  status not in ('cancelled', 'no_show')
  )

  -- Solo slots que no se solapan con ninguna cita
  select s.slot_start, s.slot_end
  from   all_slots s
  where  not exists (
    select 1 from booked b
    where  s.slot_start < b.end_time
      and  s.slot_end   > b.start_time
  )
  order  by s.slot_start;
$$;

grant execute on function get_available_slots(date, int) to anon;
