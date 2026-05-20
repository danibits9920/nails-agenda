-- ─────────────────────────────────────────────────────────────────
-- 002_rls.sql  —  Row Level Security
-- Regla general:
--   anon        → operaciones mínimas para el portal de reservas
--   authenticated → acceso total (único usuario admin)
-- ─────────────────────────────────────────────────────────────────

alter table clients       enable row level security;
alter table services      enable row level security;
alter table appointments  enable row level security;
alter table payments      enable row level security;
alter table client_notes  enable row level security;

-- ── services ─────────────────────────────────────────────────────
-- Público: leer sólo servicios activos
create policy "services_anon_select"
  on services for select to anon
  using (is_active = true);

-- Admin: todo
create policy "services_admin_all"
  on services for all to authenticated
  using (true) with check (true);

-- ── appointments ─────────────────────────────────────────────────
-- Público: insertar (reservar) + leer fecha/hora (disponibilidad)
create policy "appointments_anon_insert"
  on appointments for insert to anon
  with check (true);

create policy "appointments_anon_select"
  on appointments for select to anon
  using (true);    -- cliente sólo verá date/start_time/end_time en la UI

-- Admin: todo
create policy "appointments_admin_all"
  on appointments for all to authenticated
  using (true) with check (true);

-- ── clients ──────────────────────────────────────────────────────
-- Público: insertar su propio registro al reservar
create policy "clients_anon_insert"
  on clients for insert to anon
  with check (true);

-- Admin: todo
create policy "clients_admin_all"
  on clients for all to authenticated
  using (true) with check (true);

-- ── payments ─────────────────────────────────────────────────────
-- Público: insertar comprobante de transferencia
create policy "payments_anon_insert"
  on payments for insert to anon
  with check (true);

-- Admin: todo
create policy "payments_admin_all"
  on payments for all to authenticated
  using (true) with check (true);

-- ── client_notes ─────────────────────────────────────────────────
-- Sólo admin
create policy "client_notes_admin_all"
  on client_notes for all to authenticated
  using (true) with check (true);
