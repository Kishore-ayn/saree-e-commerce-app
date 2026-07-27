-- activity_logs: audit trail of admin actions (who did what, when),
-- independent of content rollback capability (see content_revisions
-- below). Append-only by convention -- no update/delete RLS policy will
-- be defined for this table.
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table activity_logs is 'Audit trail of admin actions (e.g. product.published, media.uploaded). Append-only.';

create index activity_logs_entity_idx on activity_logs (entity_type, entity_id);
create index activity_logs_user_created_idx on activity_logs (user_id, created_at desc);
create index activity_logs_created_at_idx on activity_logs (created_at desc);

-- content_revisions: generic version history for any content type. A new
-- content type added later (for this site or a future client) gets
-- versioning for free by writing here on every save -- no migration
-- needed per type. Rollback restores a snapshot by writing a NEW
-- revision on top, so rollback itself is always audited, never
-- destructive to history.
create table content_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  version_number integer not null,
  data jsonb not null,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, version_number)
);

comment on table content_revisions is 'Generic version history for any content type, keyed by (entity_type, entity_id, version_number). Append-only.';

create index content_revisions_entity_idx on content_revisions (entity_type, entity_id, version_number desc);
