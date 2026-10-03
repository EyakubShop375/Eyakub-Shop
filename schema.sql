-- EYAKUB SHOP DATABASE SETUP
-- Run this whole file in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text default 'Men',
  price numeric(12,2) not null default 0,
  old_price numeric(12,2),
  stock integer not null default 0,
  image_url text,
  is_flash_sale boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders(
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  status text not null default 'pending' check(status in ('pending','confirmed','shipped','delivered','cancelled')),
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items(
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  size text,
  color text
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products for select using (is_active = true or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

drop policy if exists "admin product insert" on public.products;
create policy "admin product insert" on public.products for insert with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
drop policy if exists "admin product update" on public.products;
create policy "admin product update" on public.products for update using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
drop policy if exists "admin product delete" on public.products;
create policy "admin product delete" on public.products for delete using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

drop policy if exists "customer create orders" on public.orders;
create policy "customer create orders" on public.orders for insert with check (true);
drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders" on public.orders for select using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

drop policy if exists "customer create order items" on public.order_items;
create policy "customer create order items" on public.order_items for insert with check (true);
drop policy if exists "admin read order items" on public.order_items;
create policy "admin read order items" on public.order_items for select using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- Storage policies for the existing public bucket product-images.
drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects for insert to authenticated
with check (bucket_id='product-images' and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects for update to authenticated
using (bucket_id='product-images' and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects for delete to authenticated
using (bucket_id='product-images' and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- After creating your Auth user, set that user's profile to admin.
-- Replace YOUR_AUTH_USER_UUID with the user's Auth UUID:
-- insert into public.profiles(id,full_name,role) values('YOUR_AUTH_USER_UUID','Eyakub Shop Admin','admin')
-- on conflict(id) do update set role='admin', full_name='Eyakub Shop Admin';
