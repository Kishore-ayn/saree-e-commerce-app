-- areas: local-SEO neighbourhood landing pages. Already generic in
-- structure -- any local business benefits from neighbourhood-level
-- landing pages, not just this boutique -- so the existing name and shape
-- are kept as-is rather than renamed to something more abstract.
create table areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  title text not null,
  meta_description text,
  h1 text,
  intro text,
  landmarks jsonb not null default '[]'::jsonb,
  status content_status not null default 'draft',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table areas is 'Local-SEO neighbourhood landing pages. Generic in structure; reusable by any local business.';

create index areas_status_idx on areas (status);

create table area_collections (
  area_id uuid not null references areas (id) on delete cascade,
  collection_id uuid not null references collections (id) on delete cascade,
  primary key (area_id, collection_id)
);

create index area_collections_collection_idx on area_collections (collection_id);

-- faqs: a real table (rather than JSON embedded on areas, which is what
-- the current Area.faqs shape does) so individual FAQ entries are
-- editable one at a time, independently draftable, and reusable site-wide.
-- area_id null means a site-wide/global FAQ; set means scoped to that
-- area landing page.
create table faqs (
  id uuid primary key default gen_random_uuid(),
  area_id uuid references areas (id) on delete cascade,
  question text not null,
  content text not null,
  position integer not null default 0,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table faqs is 'FAQ entries. area_id null means a site-wide/global FAQ; set means scoped to that area landing page.';

create index faqs_area_idx on faqs (area_id);
create index faqs_status_idx on faqs (status);
