-- collections: first-class grouping entity. Named to match the existing
-- Collection TypeScript interface (product collections for this site;
-- reusable as service categories or similar for a future client) rather
-- than a more abstract name, since the existing name already generalizes
-- fine and renaming would only widen the integration diff later.
create table collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  title text not null,
  meta_description text,
  h1 text,
  intro text,
  seo_heading text,
  seo_content jsonb not null default '[]'::jsonb,
  image_media_id uuid references media (id) on delete set null,
  status content_status not null default 'draft',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table collections is 'First-class grouping entity: product collections for this site, structurally reusable as service categories for other verticals.';

create index collections_status_idx on collections (status);

-- Directed "see also" links between collections, matching today's
-- Collection.relatedCollections: string[]. Directed rather than
-- symmetric, since A listing B as related doesn't require B to list A.
create table collection_related_collections (
  collection_id uuid not null references collections (id) on delete cascade,
  related_collection_id uuid not null references collections (id) on delete cascade,
  primary key (collection_id, related_collection_id),
  constraint collection_related_collections_not_self check (collection_id <> related_collection_id)
);

comment on table collection_related_collections is 'Directed "you may also like this collection" links.';
