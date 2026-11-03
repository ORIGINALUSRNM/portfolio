-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- IMPORTANT: if you sign in to /admin with a different email, change it in the 4 places below.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  description text,
  live_url text,
  repo_url text,
  tags text[] not null default '{}',
  screenshots text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Let the site's API roles use the table. The policies below still decide which rows each one can see or change.
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

-- Anyone can read published projects.
drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select
  using (published = true or (auth.jwt() ->> 'email') = 'jason.s.hornbuckle@gmail.com');

-- Only you can add, edit or delete.
drop policy if exists "Owner can manage projects" on public.projects;
create policy "Owner can manage projects"
  on public.projects for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'jason.s.hornbuckle@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'jason.s.hornbuckle@gmail.com');

-- Public bucket for screenshots.
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', true)
on conflict (id) do update set public = true;

drop policy if exists "Owner can upload screenshots" on storage.objects;
create policy "Owner can upload screenshots"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'screenshots' and (auth.jwt() ->> 'email') = 'jason.s.hornbuckle@gmail.com');

drop policy if exists "Owner can delete screenshots" on storage.objects;
create policy "Owner can delete screenshots"
  on storage.objects for delete to authenticated
  using (bucket_id = 'screenshots' and (auth.jwt() ->> 'email') = 'jason.s.hornbuckle@gmail.com');
