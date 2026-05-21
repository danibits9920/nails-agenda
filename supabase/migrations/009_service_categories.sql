-- ── 009_service_categories.sql ───────────────────────────────────────────────

create table if not exists service_categories (
  id            uuid        primary key default gen_random_uuid(),
  slug          text        not null unique,
  label         text        not null,
  display_order int         not null default 0,
  created_at    timestamptz not null default now()
);

alter table service_categories enable row level security;

create policy "public_read_categories"
  on service_categories for select
  to anon, authenticated using (true);

create policy "auth_write_categories"
  on service_categories for all
  to authenticated using (true) with check (true);

-- Seed con las categorías actuales
insert into service_categories (slug, label, display_order) values
  ('manicure', 'Manicure', 0),
  ('pedicure', 'Pedicure', 1),
  ('gel',      'Gel',      2),
  ('acrilico', 'Acrílico', 3),
  ('nail_art', 'Nail Art', 4),
  ('otros',    'Otros',    5)
on conflict (slug) do nothing;
