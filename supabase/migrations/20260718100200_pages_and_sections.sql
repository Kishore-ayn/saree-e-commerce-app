-- pages: section-driven marketing pages (Home, About, Contact today; any
-- future landing page). template selects which Next.js layout renders it,
-- directly supporting "different page layouts" without hardcoding page logic.
create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  template text not null default 'standard' check (template in ('home', 'standard', 'landing')),
  meta_title text,
  meta_description text,
  og_media_id uuid references media (id) on delete set null,
  status content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references profiles (id) on delete set null,
  updated_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table pages is 'Section-driven marketing pages. template selects the Next.js layout that renders its page_sections.';

create index pages_status_idx on pages (status);

-- page_sections: the generic, reusable half of the hybrid content model.
-- Free-form content blocks (hero copy, about text, footer columns) that
-- vary the most between different businesses live here as typed-by-
-- convention JSON, so a new client's marketing pages don't require a
-- schema migration -- only a TypeScript union update for new section types.
create table page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages (id) on delete cascade,
  section_type text not null check (section_type in ('hero', 'about', 'faq', 'testimonials', 'gallery', 'cta', 'custom')),
  position integer not null default 0,
  data jsonb not null default '{}'::jsonb,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table page_sections is 'Generic content blocks within a page. data shape depends on section_type and is validated at the application layer via a TypeScript discriminated union, not at the DB layer.';

create index page_sections_page_position_idx on page_sections (page_id, position);
create index page_sections_page_status_idx on page_sections (page_id, status);
