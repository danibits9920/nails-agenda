-- ═══════════════════════════════════════════════════════════════════════════
-- setup_completo.sql — Nails Art Yurany
--
-- Consolidado de las migraciones 001–011 para levantar una INSTANCIA NUEVA
-- de Supabase de una sola pasada. Es idempotente: se puede correr más de una
-- vez sin romper nada ni duplicar datos.
--
-- Uso: Supabase Dashboard → SQL Editor → pegar todo → Run.
--
-- OJO: esto NO crea el usuario admin. Eso se hace en
-- Authentication → Users → Add user (ver instrucciones en MIGRACION.md).
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Extensiones ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ═══════════════════════════ TABLAS ════════════════════════════════════════

-- Clientes
create table if not exists clients (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text,
  phone       text,
  birthdate   date,
  preferences jsonb       not null default '{}',
  allergies   text,
  notes       text,
  created_at  timestamptz not null default now()
);
create unique index if not exists clients_email_unique
  on clients(email) where email is not null;

-- Servicios
create table if not exists services (
  id               uuid          primary key default gen_random_uuid(),
  name             text          not null,
  description      text,
  category         text          not null
    check (category in ('manicure','pedicure','nail_art','gel','acrilico','otros')),
  duration_minutes int           not null check (duration_minutes > 0),
  price            numeric(10,2) not null check (price >= 0),
  is_active        boolean       not null default true,
  created_at       timestamptz   not null default now()
);

-- Citas
create table if not exists appointments (
  id             uuid        primary key default gen_random_uuid(),
  client_id      uuid        references clients(id)  on delete set null,
  service_id     uuid        references services(id) on delete set null,
  date           date        not null,
  start_time     time        not null,
  end_time       time        not null,
  status         text        not null default 'pending'
    check (status in ('pending','confirmed','in_progress','completed','cancelled','no_show')),
  notes          text,
  payment_status text        not null default 'unpaid'
    check (payment_status in ('unpaid','pending_verification','paid')),
  created_at     timestamptz not null default now(),
  constraint appointments_time_check check (end_time > start_time)
);
create index if not exists appointments_date_idx   on appointments(date);
create index if not exists appointments_status_idx on appointments(status);
create index if not exists appointments_client_idx on appointments(client_id);

-- Anti doble-reserva (cierra la condición de carrera que la app no puede)
do $do$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'appointments_no_overlap'
  ) then
    alter table appointments
      add constraint appointments_no_overlap
      exclude using gist (
        tsrange((date + start_time)::timestamp, (date + end_time)::timestamp, '[)') with &&
      )
      where (status not in ('cancelled', 'no_show'));
  end if;
end $do$;

-- Pagos
create table if not exists payments (
  id             uuid          primary key default gen_random_uuid(),
  appointment_id uuid          not null references appointments(id) on delete cascade,
  method         text          not null check (method in ('cash','transfer','online')),
  amount         numeric(10,2) not null check (amount > 0),
  status         text          not null default 'pending'
    check (status in ('pending','verified','rejected')),
  proof_url      text,
  gateway_id     text,
  created_at     timestamptz   not null default now()
);
create index if not exists payments_appointment_idx on payments(appointment_id);

-- Notas del cliente
create table if not exists client_notes (
  id             uuid        primary key default gen_random_uuid(),
  client_id      uuid        not null references clients(id)      on delete cascade,
  appointment_id uuid        references appointments(id) on delete set null,
  content        text        not null,
  created_at     timestamptz not null default now()
);
create index if not exists client_notes_client_idx on client_notes(client_id);

-- Horario de atención (dos turnos por día)
create table if not exists business_hours (
  id            uuid    primary key default gen_random_uuid(),
  day_of_week   int     not null unique check (day_of_week between 0 and 6),
  start_time_1  time    not null default '08:00',
  end_time_1    time    not null default '12:00',
  start_time_2  time    default null,
  end_time_2    time    default null,
  is_active     boolean not null default true,
  constraint bh_shift1_check check (end_time_1 > start_time_1),
  constraint bh_shift2_check check (
    (start_time_2 is null and end_time_2 is null) or
    (start_time_2 is not null and end_time_2 is not null and end_time_2 > start_time_2)
  )
);

-- Imágenes de servicios
create table if not exists service_images (
  id            uuid        primary key default gen_random_uuid(),
  service_id    uuid        not null references services(id) on delete cascade,
  storage_path  text        not null unique,
  url           text        not null,
  display_order int         not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists service_images_service_id_idx
  on service_images(service_id, display_order);

-- Categorías de servicios
create table if not exists service_categories (
  id            uuid        primary key default gen_random_uuid(),
  slug          text        not null unique,
  label         text        not null,
  display_order int         not null default 0,
  created_at    timestamptz not null default now()
);

-- Configuración del sitio (modo mantenimiento)
create table if not exists site_config (
  key   text primary key,
  value text not null
);

-- ═══════════════════════════ RLS ═══════════════════════════════════════════

alter table clients            enable row level security;
alter table services           enable row level security;
alter table appointments       enable row level security;
alter table payments           enable row level security;
alter table client_notes       enable row level security;
alter table business_hours     enable row level security;
alter table service_images     enable row level security;
alter table service_categories enable row level security;
alter table site_config        enable row level security;

-- services: público lee solo activos, admin todo
drop policy if exists "services_anon_select" on services;
create policy "services_anon_select" on services for select to anon
  using (is_active = true);
drop policy if exists "services_admin_all" on services;
create policy "services_admin_all" on services for all to authenticated
  using (true) with check (true);

-- appointments: público reserva y consulta disponibilidad, admin todo
drop policy if exists "appointments_anon_insert" on appointments;
create policy "appointments_anon_insert" on appointments for insert to anon
  with check (true);
drop policy if exists "appointments_anon_select" on appointments;
create policy "appointments_anon_select" on appointments for select to anon
  using (true);
drop policy if exists "appointments_admin_all" on appointments;
create policy "appointments_admin_all" on appointments for all to authenticated
  using (true) with check (true);

-- clients: público se registra al reservar, admin todo
drop policy if exists "clients_anon_insert" on clients;
create policy "clients_anon_insert" on clients for insert to anon
  with check (true);
drop policy if exists "clients_admin_all" on clients;
create policy "clients_admin_all" on clients for all to authenticated
  using (true) with check (true);

-- payments: público sube comprobante, admin todo
drop policy if exists "payments_anon_insert" on payments;
create policy "payments_anon_insert" on payments for insert to anon
  with check (true);
drop policy if exists "payments_admin_all" on payments;
create policy "payments_admin_all" on payments for all to authenticated
  using (true) with check (true);

-- client_notes: solo admin
drop policy if exists "client_notes_admin_all" on client_notes;
create policy "client_notes_admin_all" on client_notes for all to authenticated
  using (true) with check (true);

-- business_hours
drop policy if exists "business_hours_anon_select" on business_hours;
create policy "business_hours_anon_select" on business_hours for select to anon
  using (true);
drop policy if exists "business_hours_admin_all" on business_hours;
create policy "business_hours_admin_all" on business_hours for all to authenticated
  using (true) with check (true);

-- service_images
drop policy if exists "public_read_service_images" on service_images;
create policy "public_read_service_images" on service_images for select
  to anon, authenticated using (true);
drop policy if exists "auth_insert_service_images" on service_images;
create policy "auth_insert_service_images" on service_images for insert
  to authenticated with check (true);
drop policy if exists "auth_delete_service_images" on service_images;
create policy "auth_delete_service_images" on service_images for delete
  to authenticated using (true);

-- service_categories
drop policy if exists "public_read_categories" on service_categories;
create policy "public_read_categories" on service_categories for select
  to anon, authenticated using (true);
drop policy if exists "auth_write_categories" on service_categories;
create policy "auth_write_categories" on service_categories for all
  to authenticated using (true) with check (true);

-- site_config: el middleware la lee con anon key en cada request público
drop policy if exists "public_read" on site_config;
create policy "public_read" on site_config for select to anon using (true);
drop policy if exists "admin_write" on site_config;
create policy "admin_write" on site_config for all to service_role using (true);

-- ═══════════════════ FUNCIÓN DE DISPONIBILIDAD ═════════════════════════════
-- Versión final (migración 008): plpgsql con aritmética de minutos.

CREATE OR REPLACE FUNCTION get_available_slots(
  p_date          date,
  p_duration_mins int
)
RETURNS TABLE (slot_start time, slot_end time)
LANGUAGE plpgsql
SECURITY DEFINER
AS $fn$
DECLARE
  v_dow    int;
  v_active bool;
  v_s1 time; v_e1 time;
  v_s2 time; v_e2 time;
  v_s1_min int; v_e1_min int;
  v_s2_min int; v_e2_min int;
  v_cur    int;
  v_slot_s time;
  v_slot_e time;
BEGIN
  v_dow := EXTRACT(DOW FROM p_date)::int;

  SELECT bh.start_time_1, bh.end_time_1, bh.start_time_2, bh.end_time_2, bh.is_active
  INTO   v_s1, v_e1, v_s2, v_e2, v_active
  FROM   business_hours bh
  WHERE  bh.day_of_week = v_dow;

  IF NOT FOUND OR NOT v_active THEN
    RETURN;
  END IF;

  v_s1_min := EXTRACT(HOUR FROM v_s1)::int * 60 + EXTRACT(MINUTE FROM v_s1)::int;
  v_e1_min := EXTRACT(HOUR FROM v_e1)::int * 60 + EXTRACT(MINUTE FROM v_e1)::int;

  -- Turno 1
  v_cur := v_s1_min;
  WHILE v_cur + p_duration_mins <= v_e1_min LOOP
    v_slot_s := make_time(v_cur / 60, v_cur % 60, 0);
    v_slot_e := make_time((v_cur + p_duration_mins) / 60, (v_cur + p_duration_mins) % 60, 0);
    IF NOT EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.date = p_date
        AND a.status NOT IN ('cancelled', 'no_show')
        AND v_slot_s < a.end_time
        AND v_slot_e > a.start_time
    ) THEN
      slot_start := v_slot_s;
      slot_end   := v_slot_e;
      RETURN NEXT;
    END IF;
    v_cur := v_cur + 30;
  END LOOP;

  -- Turno 2 (opcional)
  IF v_s2 IS NOT NULL AND v_e2 IS NOT NULL THEN
    v_s2_min := EXTRACT(HOUR FROM v_s2)::int * 60 + EXTRACT(MINUTE FROM v_s2)::int;
    v_e2_min := EXTRACT(HOUR FROM v_e2)::int * 60 + EXTRACT(MINUTE FROM v_e2)::int;

    v_cur := v_s2_min;
    WHILE v_cur + p_duration_mins <= v_e2_min LOOP
      v_slot_s := make_time(v_cur / 60, v_cur % 60, 0);
      v_slot_e := make_time((v_cur + p_duration_mins) / 60, (v_cur + p_duration_mins) % 60, 0);
      IF NOT EXISTS (
        SELECT 1 FROM appointments a
        WHERE a.date = p_date
          AND a.status NOT IN ('cancelled', 'no_show')
          AND v_slot_s < a.end_time
          AND v_slot_e > a.start_time
      ) THEN
        slot_start := v_slot_s;
        slot_end   := v_slot_e;
        RETURN NEXT;
      END IF;
      v_cur := v_cur + 30;
    END LOOP;
  END IF;
END;
$fn$;

GRANT EXECUTE ON FUNCTION get_available_slots(date, int) TO anon;

-- ═══════════════════════════ STORAGE ═══════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

drop policy if exists "public_read_service_images_storage" on storage.objects;
create policy "public_read_service_images_storage" on storage.objects for select
  to anon, authenticated using (bucket_id = 'service-images');

drop policy if exists "auth_upload_service_images_storage" on storage.objects;
create policy "auth_upload_service_images_storage" on storage.objects for insert
  to authenticated with check (bucket_id = 'service-images');

drop policy if exists "auth_delete_service_images_storage" on storage.objects;
create policy "auth_delete_service_images_storage" on storage.objects for delete
  to authenticated using (bucket_id = 'service-images');

-- ═══════════════════════════ SEEDS ═════════════════════════════════════════

-- Horario: Lun–Vie dos turnos, Sáb solo mañana, Dom cerrado
insert into business_hours (day_of_week, start_time_1, end_time_1, start_time_2, end_time_2, is_active) values
  (0, '08:00', '12:00', null,    null,    false),
  (1, '08:00', '12:00', '14:00', '18:00', true),
  (2, '08:00', '12:00', '14:00', '18:00', true),
  (3, '08:00', '12:00', '14:00', '18:00', true),
  (4, '08:00', '12:00', '14:00', '18:00', true),
  (5, '08:00', '12:00', '14:00', '18:00', true),
  (6, '08:00', '12:00', null,    null,    true)
on conflict (day_of_week) do nothing;

-- Categorías
insert into service_categories (slug, label, display_order) values
  ('manicure', 'Manicure', 0),
  ('pedicure', 'Pedicure', 1),
  ('gel',      'Gel',      2),
  ('acrilico', 'Acrílico', 3),
  ('nail_art', 'Nail Art', 4),
  ('otros',    'Otros',    5)
on conflict (slug) do nothing;

-- Modo mantenimiento desactivado
insert into site_config (key, value) values ('maintenance_mode', 'false')
on conflict (key) do nothing;

-- Catálogo de servicios (solo si la tabla está vacía, para no duplicar)
insert into services (name, description, category, duration_minutes, price, is_active)
select * from (values
  ('Manicure Clásica',           'Limpieza, corte, limado y esmaltado de uñas naturales.',                      'manicure', 45, 8000::numeric,  true),
  ('Manicure Semipermanente',    'Esmaltado de larga duración (2-3 semanas) con gel UV/LED.',                   'manicure', 60, 12000::numeric, true),
  ('Pedicure Clásica',           'Limpieza, corte, lima y esmaltado de uñas de pies.',                          'pedicure', 60, 10000::numeric, true),
  ('Pedicure Semipermanente',    'Esmaltado semipermanente en pies con tratamiento de cutículas.',              'pedicure', 75, 15000::numeric, true),
  ('Uñas en Gel',                'Extensión o relleno de uñas con gel UV, forma personalizada.',                'gel',      90, 20000::numeric, true),
  ('Uñas Acrílicas',             'Construcción o relleno de uñas acrílicas resistentes.',                       'acrilico', 90, 22000::numeric, true),
  ('Nail Art Básico',            'Diseños simples: flores, líneas finas, degradado o monocromo.',               'nail_art', 30, 5000::numeric,  true),
  ('Nail Art Premium',           'Diseño artístico detallado: pedrería, efecto cromo, press-on personalizado.', 'nail_art', 60, 10000::numeric, true),
  ('Combo Mani + Pedi Clásica',  'Manicure y pedicure clásica en una sola sesión.',                             'otros',    90, 16000::numeric, true),
  ('Remoción de Gel / Acrílico', 'Remoción segura y sin daño de la uña natural.',                               'otros',    30, 6000::numeric,  true)
) as v(name, description, category, duration_minutes, price, is_active)
where not exists (select 1 from services);

-- ═══════════════════════════ VERIFICACIÓN ══════════════════════════════════
select 'tablas'       as chequeo, count(*)::text as valor from information_schema.tables
  where table_schema = 'public'
union all
select 'políticas',    count(*)::text from pg_policies where schemaname = 'public'
union all
select 'servicios',    count(*)::text from services
union all
select 'horarios',     count(*)::text from business_hours
union all
select 'categorías',   count(*)::text from service_categories
union all
select 'bucket',       coalesce((select id from storage.buckets where id = 'service-images'), 'FALTA')
union all
select 'anti-overlap', case when exists (select 1 from pg_constraint where conname = 'appointments_no_overlap')
                            then 'OK' else 'FALTA' end
union all
select 'slots_60min',  (select count(*)::text from get_available_slots(current_date + 1, 60));
