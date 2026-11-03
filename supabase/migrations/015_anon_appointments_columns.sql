-- El portal público sólo necesita saber qué horas están ocupadas
-- (get_available_slots lee date, start_time, end_time y status).
-- Antes anon podía leer la tabla entera: notas, estado de pago y, desde la
-- 014, el manage_token que da acceso a cancelar cada cita. Se limita a las
-- columnas imprescindibles.
revoke select on appointments from anon;
grant select (id, date, start_time, end_time, status) on appointments to anon;
