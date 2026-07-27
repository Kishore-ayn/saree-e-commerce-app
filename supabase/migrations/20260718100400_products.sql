-- products: structural, cross-vertical offerings. kind distinguishes
-- physical products from services without duplicating this entire table
-- (and its media/collections/revision relationships) for something that
-- isn't structurally different. attributes holds business-specific
-- variable fields (fabric/colour/occasion for this site; duration/category
-- for a future service business) as jsonb rather than hardcoded columns,
-- which would only make sense for one vertical.
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind text not null default 'product' check (kind in ('product', 'service')),
  sku text,
  name text not null,
  description text,
  long_description text,
  price numeric(12, 2),
  compare_at_price numeric(12, 2),
  attributes jsonb not null default '{}'::jsonb,
  rating numeric(2, 1),
  review_count integer not null default 0,
  in_stock boolean not null default true,
  is_new_arrival boolean not null default false,
  is_bestseller boolean not null default false,
  meta_title text,
  meta_description text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table products is 'Structural, cross-vertical offerings (products or services, per kind). attributes holds business-specific variable fields as jsonb; a GIN index supports future containment queries if server-side attribute filtering is ever needed.';

create index products_status_idx on products (status);
create index products_kind_idx on products (kind);
create index products_attributes_gin_idx on products using gin (attributes);

create table product_collections (
  product_id uuid not null references products (id) on delete cascade,
  collection_id uuid not null references collections (id) on delete cascade,
  primary key (product_id, collection_id)
);

create index product_collections_collection_idx on product_collections (collection_id);

-- product_media: ordered, multi-image gallery via a join table rather than
-- an array column, so the same media asset can be reused across products
-- (matching the existing generic saree-photo-pool pattern) with proper
-- foreign key integrity and per-product image ordering.
create table product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  media_id uuid not null references media (id) on delete cascade,
  position integer not null default 0,
  alt_text_override text,
  created_at timestamptz not null default now()
);

comment on table product_media is 'Ordered product image gallery. alt_text_override falls back to media.alt_text when null.';

create index product_media_product_position_idx on product_media (product_id, position);
create index product_media_media_idx on product_media (media_id);
