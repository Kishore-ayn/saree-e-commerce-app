-- Shared trigger function: stamps updated_at with now() on every row
-- update, applied once per table below rather than repeating the same
-- logic per table.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function set_updated_at is 'Shared trigger: stamps updated_at with now() on every row update.';

create trigger set_updated_at before update on profiles for each row execute function set_updated_at();
create trigger set_updated_at before update on media for each row execute function set_updated_at();
create trigger set_updated_at before update on pages for each row execute function set_updated_at();
create trigger set_updated_at before update on page_sections for each row execute function set_updated_at();
create trigger set_updated_at before update on collections for each row execute function set_updated_at();
create trigger set_updated_at before update on products for each row execute function set_updated_at();
create trigger set_updated_at before update on areas for each row execute function set_updated_at();
create trigger set_updated_at before update on faqs for each row execute function set_updated_at();
create trigger set_updated_at before update on blog_posts for each row execute function set_updated_at();
create trigger set_updated_at before update on testimonials for each row execute function set_updated_at();
create trigger set_updated_at before update on forms for each row execute function set_updated_at();
create trigger set_updated_at before update on site_settings for each row execute function set_updated_at();
create trigger set_updated_at before update on navigation_items for each row execute function set_updated_at();

-- Tables intentionally excluded: form_submissions, activity_logs and
-- content_revisions are append-only by design and have no updated_at
-- column to maintain.
