-- ── 006_service_images.sql ───────────────────────────────────────────────────

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

alter table service_images enable row level security;

create policy "public_read_service_images"
  on service_images for select
  to anon, authenticated
  using (true);

create policy "auth_insert_service_images"
  on service_images for insert
  to authenticated
  with check (true);

create policy "auth_delete_service_images"
  on service_images for delete
  to authenticated
  using (true);

-- ── Storage bucket ────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

create policy "public_read_service_images_storage"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'service-images');

create policy "auth_upload_service_images_storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'service-images');

create policy "auth_delete_service_images_storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'service-images');
