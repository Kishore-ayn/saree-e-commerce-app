-- Storage bucket backing the `media` table (Phase 3). Public read so
-- next/image and public pages can hit the object URL directly with no
-- signed-URL plumbing; writes are staff-only. Type/size limits are
-- enforced here (not just app-side) so a direct API call can't bypass them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  20971520, -- 20 MB
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm',
    'application/pdf'
  ]
)
on conflict (id) do nothing;

create policy "media_bucket_public_select"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media_bucket_staff_insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_editor_or_admin());

create policy "media_bucket_staff_update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_editor_or_admin());

create policy "media_bucket_staff_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_editor_or_admin());
