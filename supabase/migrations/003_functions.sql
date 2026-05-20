-- ─────────────────────────────────────────────────────────────────
-- 003_functions.sql  —  Función de disponibilidad de horarios
-- ─────────────────────────────────────────────────────────────────

-- Retorna los slots disponibles para una fecha y duración dada.
-- Horario de atención: 09:00 – 19:00, slots cada 30 minutos.
create or replace function get_available_slots(
  p_date           date,
  p_duration_mins  int
)
returns table (slot_start time, slot_end time)
language sql
security definer
as $$
  with
  -- Genera todos los slots posibles del día (cada 30 min)
  all_slots as (
    select
      (time '09:00' + (n * interval '30 minutes'))::time as slot_start,
      (time '09:00' + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute'))::time as slot_end
    from generate_series(0, 19) n  -- 0..19 → 09:00 a 18:30
    where (time '09:00' + (n * interval '30 minutes') + (p_duration_mins * interval '1 minute')) <= time '19:00'
  ),
  -- Citas activas ese día (excluye canceladas y no_show)
  booked as (
    select start_time, end_time
    from appointments
    where date = p_date
      and status not in ('cancelled', 'no_show')
  )
  -- Sólo slots que no se solapan con ninguna cita existente
  select s.slot_start, s.slot_end
  from all_slots s
  where not exists (
    select 1 from booked b
    where s.slot_start < b.end_time
      and s.slot_end   > b.start_time
  )
  order by s.slot_start;
$$;

-- Permite que anon llame esta función (necesario para el portal)
grant execute on function get_available_slots(date, int) to anon;
