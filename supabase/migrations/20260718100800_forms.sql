-- forms: schema definitions for distinct forms (contact, newsletter, quote
-- request, etc.) so a new form for a future client does not require a
-- schema migration -- only a new row.
create table forms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  fields jsonb not null default '[]'::jsonb,
  notification_email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table forms is 'Form schema definitions. fields is a jsonb array describing each field''s name/label/type/required-ness.';

-- form_submissions: public visitors can create these but must never be
-- able to read them back (enforced in the RLS migration) -- only staff
-- can view submissions.
create table form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references forms (id) on delete restrict,
  data jsonb not null default '{}'::jsonb,
  submitted_ip text,
  status text not null default 'new' check (status in ('new', 'read', 'archived', 'spam')),
  created_at timestamptz not null default now()
);

comment on table form_submissions is 'Submitted form entries. form_id uses ON DELETE RESTRICT so a form definition cannot be deleted while historical submissions still reference it.';

create index form_submissions_form_created_idx on form_submissions (form_id, created_at desc);
create index form_submissions_status_idx on form_submissions (status);
