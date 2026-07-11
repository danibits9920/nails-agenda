-- ── 010_site_config.sql ──────────────────────────────────────────────────────
-- Nota: esta tabla ya existía en producción (creada manualmente en el
-- Dashboard) antes de que existiera esta migración. El schema y las
-- políticas replican exactamente lo que hay para que quede documentado
-- y el repo deje de estar desincronizado con la base real.

create table if not exists site_config (
  key   text primary key,
  value text not null
);

alter table site_config enable row level security;

-- El middleware la lee con la anon key en cada request público (modo mantenimiento)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'site_config' and policyname = 'public_read') then
    create policy "public_read" on site_config for select to anon using (true);
  end if;
end $$;

-- Las escrituras se hacen desde el server action con el cliente service role
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'site_config' and policyname = 'admin_write') then
    create policy "admin_write" on site_config for all to service_role using (true);
  end if;
end $$;

-- Seed: mantenimiento desactivado por defecto
insert into site_config (key, value) values
  ('maintenance_mode', 'false')
on conflict (key) do nothing;
