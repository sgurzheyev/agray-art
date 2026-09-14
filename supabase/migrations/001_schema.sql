-- A.GRAY / agray.art — schema, RLS, storage
-- Run in Supabase SQL editor (project sgtkslipwvxmqcalfpvn, eu-west-1).
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.product_status as enum ('draft', 'published', 'hidden');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_kind as enum ('photo', 'video');
exception when duplicate_object then null;
end $$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ru text not null,
  name_en text not null default '',
  blurb_ru text not null default '',
  sort_order int not null default 0,
  visible boolean not null default true
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text unique not null,
  title_ru text not null,
  description_ru text not null default '',
  price_cents bigint not null check (price_cents >= 0),
  currency text not null default 'RUB',
  metal text not null default '',
  assay text not null default '',
  weight_g numeric(10,2) not null default 0,
  size_label text,
  sizes jsonb not null default '[]'::jsonb,
  sku text unique not null,
  stone text,
  lead_days int not null default 14,
  status public.product_status not null default 'published',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_featured_idx on public.products (featured);

create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  kind public.media_kind not null default 'photo',
  url text not null,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_media_product_id_idx on public.product_media (product_id);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label_ru text not null default '',
  href text not null default '',
  visible boolean not null default true,
  sort_order int not null default 0,
  meta jsonb not null default '{}'::jsonb
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new',
  customer_email text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "public read visible categories" on public.categories;
drop policy if exists "admin all categories" on public.categories;
create policy "public read visible categories"
  on public.categories for select
  using (visible = true);
create policy "admin all categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "public read published products" on public.products;
drop policy if exists "admin all products" on public.products;
create policy "public read published products"
  on public.products for select
  using (status = 'published');
create policy "admin all products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "public read published media" on public.product_media;
drop policy if exists "admin all media" on public.product_media;
create policy "public read published media"
  on public.product_media for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_media.product_id
        and p.status = 'published'
    )
  );
create policy "admin all media"
  on public.product_media for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "public read visible settings" on public.site_settings;
drop policy if exists "admin all settings" on public.site_settings;
create policy "public read visible settings"
  on public.site_settings for select
  using (visible = true);
create policy "admin all settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin read orders" on public.orders;
drop policy if exists "admin write orders" on public.orders;
create policy "admin read orders"
  on public.orders for select
  using (public.is_admin());
create policy "admin write orders"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin read admin_users" on public.admin_users;
create policy "admin read admin_users"
  on public.admin_users for select
  using (auth.uid() = user_id or public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update set public = true;

drop policy if exists "public read product-media" on storage.objects;
drop policy if exists "admin insert product-media" on storage.objects;
drop policy if exists "admin update product-media" on storage.objects;
drop policy if exists "admin delete product-media" on storage.objects;

create policy "public read product-media"
  on storage.objects for select
  using (bucket_id = 'product-media');

create policy "admin insert product-media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-media' and public.is_admin());

create policy "admin update product-media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-media' and public.is_admin())
  with check (bucket_id = 'product-media' and public.is_admin());

create policy "admin delete product-media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-media' and public.is_admin());
