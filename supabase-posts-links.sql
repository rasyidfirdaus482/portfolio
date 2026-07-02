alter table public.posts
add column if not exists github text,
add column if not exists demo text;

create table if not exists public.site_settings (
    key text primary key,
    value text not null default '',
    updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Site settings are publicly readable" on public.site_settings;
create policy "Site settings are publicly readable" on public.site_settings
for select to public
using (true);

drop policy if exists "Authenticated users can manage site settings" on public.site_settings;
create policy "Authenticated users can manage site settings" on public.site_settings
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into public.site_settings (key, value)
values ('resume_url', '')
on conflict (key) do nothing;

insert into public.site_settings (key, value)
values ('about_profile', '')
on conflict (key) do nothing;

create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    message text not null,
    read boolean not null default false,
    created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
create policy "Anyone can submit contact messages" on public.contact_messages
for insert to public
with check (true);

drop policy if exists "Authenticated users can read contact messages" on public.contact_messages;
create policy "Authenticated users can read contact messages" on public.contact_messages
for select to authenticated
using (auth.role() = 'authenticated');
