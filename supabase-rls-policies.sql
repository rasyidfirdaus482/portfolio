-- ============================================================
-- RLS (Row Level Security) Policies — Portfolio Supabase
-- ============================================================
-- Jalankan SQL ini di Supabase Dashboard → SQL Editor
-- File ini bersifat idempotent (aman dijalankan berulang kali).
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. TABEL: posts
-- ────────────────────────────────────────────────────────────
-- Aktifkan RLS pada tabel posts
alter table public.posts enable row level security;

-- Policy: Publik hanya bisa membaca post yang sudah published
drop policy if exists "Published posts are publicly readable" on public.posts;
create policy "Published posts are publicly readable" on public.posts
    for select
    to anon, authenticated
    using (published = true);

-- Policy: Authenticated users bisa membaca SEMUA post (termasuk draft)
drop policy if exists "Authenticated users can read all posts" on public.posts;
create policy "Authenticated users can read all posts" on public.posts
    for select
    to authenticated
    using (true);

-- Policy: Authenticated users bisa membuat post baru
drop policy if exists "Authenticated users can create posts" on public.posts;
create policy "Authenticated users can create posts" on public.posts
    for insert
    to authenticated
    with check (auth.role() = 'authenticated');

-- Policy: Authenticated users bisa mengupdate post
drop policy if exists "Authenticated users can update posts" on public.posts;
create policy "Authenticated users can update posts" on public.posts
    for update
    to authenticated
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Policy: Authenticated users bisa menghapus post
drop policy if exists "Authenticated users can delete posts" on public.posts;
create policy "Authenticated users can delete posts" on public.posts
    for delete
    to authenticated
    using (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- 2. TABEL: site_settings (validasi ulang)
-- ────────────────────────────────────────────────────────────
alter table public.site_settings enable row level security;

drop policy if exists "Site settings are publicly readable" on public.site_settings;
create policy "Site settings are publicly readable" on public.site_settings
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Authenticated users can manage site settings" on public.site_settings;
create policy "Authenticated users can manage site settings" on public.site_settings
    for all
    to authenticated
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- 3. TABEL: contact_messages (validasi ulang + tambah delete)
-- ────────────────────────────────────────────────────────────
alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
create policy "Anyone can submit contact messages" on public.contact_messages
    for insert
    to anon, authenticated
    with check (true);

drop policy if exists "Authenticated users can read contact messages" on public.contact_messages;
create policy "Authenticated users can read contact messages" on public.contact_messages
    for select
    to authenticated
    using (auth.role() = 'authenticated');

-- Policy baru: Authenticated users bisa menghapus contact messages
drop policy if exists "Authenticated users can delete contact messages" on public.contact_messages;
create policy "Authenticated users can delete contact messages" on public.contact_messages
    for delete
    to authenticated
    using (auth.role() = 'authenticated');

-- Policy baru: Authenticated users bisa update contact messages (mark as read)
drop policy if exists "Authenticated users can update contact messages" on public.contact_messages;
create policy "Authenticated users can update contact messages" on public.contact_messages
    for update
    to authenticated
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- 4. STORAGE BUCKET: images
-- ────────────────────────────────────────────────────────────
-- Pastikan bucket "images" ada dan bersifat public (untuk akses gambar)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

-- Policy: Siapapun bisa melihat/download file dari bucket images
drop policy if exists "Public read access for images bucket" on storage.objects;
create policy "Public read access for images bucket" on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'images');

-- Policy: Hanya authenticated users yang bisa upload
drop policy if exists "Authenticated users can upload to images bucket" on storage.objects;
create policy "Authenticated users can upload to images bucket" on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'images');

-- Policy: Hanya authenticated users yang bisa update file
drop policy if exists "Authenticated users can update images bucket" on storage.objects;
create policy "Authenticated users can update images bucket" on storage.objects
    for update
    to authenticated
    using (bucket_id = 'images')
    with check (bucket_id = 'images');

-- Policy: Hanya authenticated users yang bisa delete file
drop policy if exists "Authenticated users can delete from images bucket" on storage.objects;
create policy "Authenticated users can delete from images bucket" on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'images');
