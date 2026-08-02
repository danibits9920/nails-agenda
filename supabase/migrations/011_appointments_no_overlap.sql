-- ── 011_appointments_no_overlap.sql ─────────────────────────────────────────
-- Previene la doble reserva (double-booking) a nivel de base de datos.
--
-- El negocio atiende de a una clienta a la vez (una sola manicurista), así que
-- dos citas activas nunca deben solaparse en el tiempo. Esta restricción de
-- exclusión lo garantiza incluso ante inserciones concurrentes, que es la
-- condición de carrera que la validación en la app no puede cerrar por sí sola.
--
-- Se combinan fecha + hora en un rango de timestamp y se exige que no haya
-- solapamiento (&&). El rango es [inicio, fin): una cita que termina a las 10:00
-- y otra que empieza a las 10:00 NO se consideran solapadas.
--
-- Las citas canceladas o "no se presentó" se excluyen del chequeo, de modo que
-- un horario liberado por una cancelación se puede volver a reservar.

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE appointments
  ADD CONSTRAINT appointments_no_overlap
  EXCLUDE USING gist (
    tsrange(
      (date + start_time)::timestamp,
      (date + end_time)::timestamp,
      '[)'
    ) WITH &&
  )
  WHERE (status NOT IN ('cancelled', 'no_show'));
