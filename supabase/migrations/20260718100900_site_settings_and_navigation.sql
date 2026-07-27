-- site_settings: single-row table for business info, hours, social links,
-- theme colors, analytics IDs and default SEO. Maps closely onto the
-- existing lib/site-config.ts shape, so Phase 11's getSiteSettings() can
-- return a near-identical object. A single-row table (rather than a
-- generic key-value settings table) keeps a clean 1:1 mapping to one
-- TypeScript shape; these fields are well-known upfront, so the added
-- flexibility of a key-value table isn't needed yet.
create table site_settings (
  id integer primary key default 1,
  business_name text not null default '',
  tagline text,
  description text,
  phone text,
  whatsapp text,
  email text,
  address jsonb not null default '{}'::jsonb,
  geo jsonb not null default '{}'::jsonb,
  business_hours jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  analytics jsonb not null default '{}'::jsonb,
  default_seo jsonb not null default '{}'::jsonb,
  updated_by uuid references profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

comment on table site_settings is 'Single-row table (id always 1) for business info, hours, social links, theme colors, analytics IDs and default SEO.';

insert into site_settings (id) values (1);

-- navigation_items: header and footer links share this one table,
-- disambiguated by location, since they are structurally identical
-- (label + link + position) and don't warrant two near-duplicate tables.
create table navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  location text not null check (location in ('header', 'footer')),
  parent_id uuid references navigation_items (id) on delete cascade,
  position integer not null default 0,
  open_in_new_tab boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table navigation_items is 'Header and footer navigation links, disambiguated by location.';

create index navigation_items_location_parent_position_idx on navigation_items (location, parent_id, position);
