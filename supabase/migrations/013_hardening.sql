-- ─────────────────────────────────────────────────────────────────
-- 013_hardening.sql  —  Ajustes señalados por el linter de Supabase
--
-- 1. get_available_slots es SECURITY DEFINER sin search_path fijo: un rol
--    con permiso de crear objetos podría hacer que resuelva otra tabla.
--    Se fija a public, igual que get_report_stats.
-- 2. Índice de client_notes.appointment_id (clave foránea sin índice).
--    La de appointments.service_id ya la cubre appointments_service_status_idx (012).
-- ─────────────────────────────────────────────────────────────────

alter function get_available_slots(date, integer) set search_path = public;

create index if not exists client_notes_appointment_id_idx
  on client_notes (appointment_id);
