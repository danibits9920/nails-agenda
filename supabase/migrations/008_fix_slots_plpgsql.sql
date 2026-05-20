-- ── 008_fix_slots_plpgsql.sql ────────────────────────────────────────────────
-- Reescribe get_available_slots en plpgsql con aritmética de minutos
-- para evitar el bug de scope de start_time_1 en language sql con CTEs.

CREATE OR REPLACE FUNCTION get_available_slots(
  p_date          date,
  p_duration_mins int
)
RETURNS TABLE (slot_start time, slot_end time)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_dow        int;
  v_active     bool;
  v_s1         time;  v_e1 time;
  v_s2         time;  v_e2 time;
  v_s1_min     int;   v_e1_min int;
  v_s2_min     int;   v_e2_min int;
  v_cur        int;
  v_slot_s     time;
  v_slot_e     time;
BEGIN
  -- Día de la semana (0=Domingo … 6=Sábado)
  v_dow := EXTRACT(DOW FROM p_date)::int;

  -- Horario configurado para ese día
  SELECT bh.start_time_1, bh.end_time_1,
         bh.start_time_2, bh.end_time_2,
         bh.is_active
  INTO   v_s1, v_e1, v_s2, v_e2, v_active
  FROM   business_hours bh
  WHERE  bh.day_of_week = v_dow;

  -- Día sin configurar o inactivo → devolver vacío
  IF NOT FOUND OR NOT v_active THEN
    RETURN;
  END IF;

  -- Convertir tiempos a minutos desde medianoche
  v_s1_min := EXTRACT(HOUR FROM v_s1)::int * 60 + EXTRACT(MINUTE FROM v_s1)::int;
  v_e1_min := EXTRACT(HOUR FROM v_e1)::int * 60 + EXTRACT(MINUTE FROM v_e1)::int;

  -- ── Turno 1 ────────────────────────────────────────────────────────────────
  v_cur := v_s1_min;
  WHILE v_cur + p_duration_mins <= v_e1_min LOOP
    v_slot_s := make_time(v_cur / 60, v_cur % 60, 0);
    v_slot_e := make_time((v_cur + p_duration_mins) / 60,
                          (v_cur + p_duration_mins) % 60, 0);

    IF NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE  a.date   = p_date
        AND  a.status NOT IN ('cancelled', 'no_show')
        AND  v_slot_s < a.end_time
        AND  v_slot_e > a.start_time
    ) THEN
      slot_start := v_slot_s;
      slot_end   := v_slot_e;
      RETURN NEXT;
    END IF;

    v_cur := v_cur + 30;
  END LOOP;

  -- ── Turno 2 (opcional) ─────────────────────────────────────────────────────
  IF v_s2 IS NOT NULL AND v_e2 IS NOT NULL THEN
    v_s2_min := EXTRACT(HOUR FROM v_s2)::int * 60 + EXTRACT(MINUTE FROM v_s2)::int;
    v_e2_min := EXTRACT(HOUR FROM v_e2)::int * 60 + EXTRACT(MINUTE FROM v_e2)::int;

    v_cur := v_s2_min;
    WHILE v_cur + p_duration_mins <= v_e2_min LOOP
      v_slot_s := make_time(v_cur / 60, v_cur % 60, 0);
      v_slot_e := make_time((v_cur + p_duration_mins) / 60,
                            (v_cur + p_duration_mins) % 60, 0);

      IF NOT EXISTS (
        SELECT 1 FROM appointments a
        WHERE  a.date   = p_date
          AND  a.status NOT IN ('cancelled', 'no_show')
          AND  v_slot_s < a.end_time
          AND  v_slot_e > a.start_time
      ) THEN
        slot_start := v_slot_s;
        slot_end   := v_slot_e;
        RETURN NEXT;
      END IF;

      v_cur := v_cur + 30;
    END LOOP;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION get_available_slots(date, int) TO anon;
