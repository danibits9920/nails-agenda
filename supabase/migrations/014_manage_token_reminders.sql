-- Enlace privado para que la clienta gestione su cita, y marca de recordatorio.
--
-- manage_token: secreto aleatorio que va en el correo. No se usa el id de la
-- cita porque ése aparece en el panel y en la URL de confirmación.
-- reminder_sent_at: evita mandar dos veces el recordatorio si el envío diario
-- se ejecuta más de una vez.
alter table appointments
  add column if not exists manage_token uuid not null default gen_random_uuid(),
  add column if not exists reminder_sent_at timestamptz;

create unique index if not exists appointments_manage_token_idx on appointments (manage_token);
