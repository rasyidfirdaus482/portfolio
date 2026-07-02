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
