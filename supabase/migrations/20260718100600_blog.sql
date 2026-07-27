-- blog_posts: content is markdown, replacing the current bespoke
-- "## Heading" plain-string-array convention (only components/blog/
-- BlogContent.tsx knows how to parse today). Markdown is a standard
-- format with mature editor widgets for the admin UI and mature renderers
-- for display -- a deliberate, one-time change rather than carrying the
-- custom convention into the CMS.
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  author_name text,
  cover_media_id uuid references media (id) on delete set null,
  meta_title text,
  meta_description text,
  status content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table blog_posts is 'Blog posts. content is markdown. author_name is plain text (not a profiles FK) since blog authorship is often a business persona, not necessarily a logged-in user.';

create index blog_posts_status_published_idx on blog_posts (status, published_at desc);

create table blog_post_collections (
  blog_post_id uuid not null references blog_posts (id) on delete cascade,
  collection_id uuid not null references collections (id) on delete cascade,
  primary key (blog_post_id, collection_id)
);

create index blog_post_collections_collection_idx on blog_post_collections (collection_id);
