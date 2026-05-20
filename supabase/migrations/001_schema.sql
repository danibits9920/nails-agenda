-- ─────────────────────────────────────────────────────────────────
-- 001_schema.sql  —  Nails Art Yurany
-- ─────────────────────────────────────────────────────────────────

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
-- Email único sólo cuando tiene valor (permite múltiples NULL)
create unique index if not exists clients_email_unique
  on clients(email) where email is not null;

-- Servicios
create table if not exists services (
  id               uuid        primary key default gen_random_uuid(),
  name             text        not null,
  description      text,
  category         text        not null
    check (category in ('manicure','pedicure','nail_art','gel','acrilico','otros')),
  duration_minutes int         not null check (duration_minutes > 0),
  price            numeric(10,2) not null check (price >= 0),
  is_active        boolean     not null default true,
  created_at       timestamptz not null default now()
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

-- Notas del cliente (por sesión)
create table if not exists client_notes (
  id             uuid        primary key default gen_random_uuid(),
  client_id      uuid        not null references clients(id)      on delete cascade,
  appointment_id uuid        references appointments(id) on delete set null,
  content        text        not null,
  created_at     timestamptz not null default now()
);
create index if not exists client_notes_client_idx on client_notes(client_id);
