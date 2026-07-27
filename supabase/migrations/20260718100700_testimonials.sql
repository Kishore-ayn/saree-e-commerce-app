-- testimonials: universal business content type across verticals.
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  content text not null,
  rating numeric(2, 1),
  avatar_media_id uuid references media (id) on delete set null,
  status content_status not null default 'draft',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index testimonials_status_position_idx on testimonials (status, position);
