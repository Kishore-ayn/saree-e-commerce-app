-- profiles: app-specific fields per Supabase Auth user (display name, CMS role).
-- Supabase's own guidance is to never add columns directly to auth.users;
-- a companion table keyed by the same id is the standard pattern.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is 'App-specific fields per Supabase Auth user: display name and CMS role (admin/editor).';

-- media: single source of truth for anything uploaded through the admin
-- Media Library (Supabase Storage). Entirely separate from the existing
-- build-time public/images pipeline, which this table does not manage or
-- migrate.
create table media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  file_type text not null check (file_type in ('image', 'video', 'pdf')),
  mime_type text not null,
  size_bytes bigint not null,
  width integer,
  height integer,
  alt_text text,
  caption text,
  uploaded_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table media is 'Metadata for files uploaded via the admin Media Library. Public URLs are derived from storage_path at read time in lib/cms/media.ts, not stored, so they never go stale.';

create index media_file_type_idx on media (file_type);
create index media_uploaded_by_idx on media (uploaded_by);
create index media_created_at_idx on media (created_at desc);

-- Added after media exists to avoid a circular forward-reference between
-- the two tables (profiles.avatar -> media, media.uploaded_by -> profiles).
alter table profiles
  add column avatar_media_id uuid references media (id) on delete set null;
