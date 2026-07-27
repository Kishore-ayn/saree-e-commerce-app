-- Row Level Security for every table in the CMS schema.
--
-- This migration relies on Supabase's default project privileges: a
-- fresh Supabase project already grants broad table-level privileges to
-- the `anon` and `authenticated` roles at the schema level, and expects
-- RLS policies (not GRANT/REVOKE) to be the actual access-control
-- mechanism. This file adds no manual GRANT statements and instead
-- defines RLS policies as the sole gate, matching that documented model.
--
-- Pattern used throughout: two permissive SELECT policies per public-
-- facing content table -- one for "public sees published rows only", one
-- for "editors/admins see everything" -- combined with OR by Postgres
-- when multiple permissive policies apply to the same command.

-- ---------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------

-- security definer so the function can read `profiles` regardless of the
-- calling role's own RLS visibility into that table, avoiding a
-- chicken-and-egg recursion where checking a role requires a policy that
-- itself depends on checking a role.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  );
$$;

create or replace function is_editor_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where profiles.id = auth.uid() and profiles.role in ('admin', 'editor')
  );
$$;

comment on function is_admin is 'True if the current session belongs to a profile with role = admin.';
comment on function is_editor_or_admin is 'True if the current session belongs to a profile with role admin or editor.';

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (is_admin());

create policy "Admins can insert profiles"
  on profiles for insert
  with check (is_admin());

create policy "Users can update their own profile; admins can update any"
  on profiles for update
  using (auth.uid() = id or is_admin());

create policy "Admins can delete profiles"
  on profiles for delete
  using (is_admin());

-- Column-level protection RLS cannot express directly: a non-admin may
-- update their own row (e.g. full_name, avatar) but must never be able to
-- change their own role, even though the app UI never exposes that path.
create or replace function prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not is_admin() then
    raise exception 'Only admins can change a profile role.';
  end if;
  return new;
end;
$$;

create trigger prevent_self_role_escalation
  before update on profiles
  for each row execute function prevent_self_role_escalation();

-- ---------------------------------------------------------------------
-- media
-- ---------------------------------------------------------------------

alter table media enable row level security;

create policy "Anyone can view media metadata"
  on media for select
  using (true);

create policy "Editors and admins can insert media"
  on media for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update media"
  on media for update
  using (is_editor_or_admin());

create policy "Editors and admins can delete media"
  on media for delete
  using (is_editor_or_admin());

-- ---------------------------------------------------------------------
-- pages / page_sections
-- ---------------------------------------------------------------------

alter table pages enable row level security;

create policy "Public can view published pages"
  on pages for select
  using (status = 'published');

create policy "Editors and admins can view all pages"
  on pages for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert pages"
  on pages for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update pages"
  on pages for update
  using (is_editor_or_admin());

create policy "Admins can delete pages"
  on pages for delete
  using (is_admin());

alter table page_sections enable row level security;

create policy "Public can view published sections of published pages"
  on page_sections for select
  using (
    status = 'published'
    and exists (
      select 1 from pages
      where pages.id = page_sections.page_id and pages.status = 'published'
    )
  );

create policy "Editors and admins can view all sections"
  on page_sections for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert sections"
  on page_sections for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update sections"
  on page_sections for update
  using (is_editor_or_admin());

create policy "Admins can delete sections"
  on page_sections for delete
  using (is_admin());

-- ---------------------------------------------------------------------
-- collections
-- ---------------------------------------------------------------------

alter table collections enable row level security;

create policy "Public can view published collections"
  on collections for select
  using (status = 'published');

create policy "Editors and admins can view all collections"
  on collections for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert collections"
  on collections for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update collections"
  on collections for update
  using (is_editor_or_admin());

create policy "Admins can delete collections"
  on collections for delete
  using (is_admin());

alter table collection_related_collections enable row level security;

create policy "Anyone can view related-collection links"
  on collection_related_collections for select
  using (true);

create policy "Editors and admins can insert related-collection links"
  on collection_related_collections for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can delete related-collection links"
  on collection_related_collections for delete
  using (is_editor_or_admin());

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------

alter table products enable row level security;

create policy "Public can view published products"
  on products for select
  using (status = 'published');

create policy "Editors and admins can view all products"
  on products for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert products"
  on products for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update products"
  on products for update
  using (is_editor_or_admin());

create policy "Admins can delete products"
  on products for delete
  using (is_admin());

alter table product_collections enable row level security;

create policy "Anyone can view product-collection links"
  on product_collections for select
  using (true);

create policy "Editors and admins can insert product-collection links"
  on product_collections for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can delete product-collection links"
  on product_collections for delete
  using (is_editor_or_admin());

alter table product_media enable row level security;

create policy "Anyone can view product media links"
  on product_media for select
  using (true);

create policy "Editors and admins can insert product media links"
  on product_media for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update product media links"
  on product_media for update
  using (is_editor_or_admin());

create policy "Editors and admins can delete product media links"
  on product_media for delete
  using (is_editor_or_admin());

-- ---------------------------------------------------------------------
-- areas / faqs
-- ---------------------------------------------------------------------

alter table areas enable row level security;

create policy "Public can view published areas"
  on areas for select
  using (status = 'published');

create policy "Editors and admins can view all areas"
  on areas for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert areas"
  on areas for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update areas"
  on areas for update
  using (is_editor_or_admin());

create policy "Admins can delete areas"
  on areas for delete
  using (is_admin());

alter table area_collections enable row level security;

create policy "Anyone can view area-collection links"
  on area_collections for select
  using (true);

create policy "Editors and admins can insert area-collection links"
  on area_collections for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can delete area-collection links"
  on area_collections for delete
  using (is_editor_or_admin());

alter table faqs enable row level security;

create policy "Public can view published faqs"
  on faqs for select
  using (
    status = 'published'
    and (
      area_id is null
      or exists (select 1 from areas where areas.id = faqs.area_id and areas.status = 'published')
    )
  );

create policy "Editors and admins can view all faqs"
  on faqs for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert faqs"
  on faqs for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update faqs"
  on faqs for update
  using (is_editor_or_admin());

create policy "Admins can delete faqs"
  on faqs for delete
  using (is_admin());

-- ---------------------------------------------------------------------
-- blog_posts
-- ---------------------------------------------------------------------

alter table blog_posts enable row level security;

create policy "Public can view published blog posts"
  on blog_posts for select
  using (status = 'published');

create policy "Editors and admins can view all blog posts"
  on blog_posts for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert blog posts"
  on blog_posts for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update blog posts"
  on blog_posts for update
  using (is_editor_or_admin());

create policy "Admins can delete blog posts"
  on blog_posts for delete
  using (is_admin());

alter table blog_post_collections enable row level security;

create policy "Anyone can view blog post-collection links"
  on blog_post_collections for select
  using (true);

create policy "Editors and admins can insert blog post-collection links"
  on blog_post_collections for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can delete blog post-collection links"
  on blog_post_collections for delete
  using (is_editor_or_admin());

-- ---------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------

alter table testimonials enable row level security;

create policy "Public can view published testimonials"
  on testimonials for select
  using (status = 'published');

create policy "Editors and admins can view all testimonials"
  on testimonials for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert testimonials"
  on testimonials for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update testimonials"
  on testimonials for update
  using (is_editor_or_admin());

create policy "Admins can delete testimonials"
  on testimonials for delete
  using (is_admin());

-- ---------------------------------------------------------------------
-- forms / form_submissions
-- ---------------------------------------------------------------------

alter table forms enable row level security;

create policy "Public can view active forms"
  on forms for select
  using (is_active = true);

create policy "Editors and admins can view all forms"
  on forms for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert forms"
  on forms for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update forms"
  on forms for update
  using (is_editor_or_admin());

create policy "Admins can delete forms"
  on forms for delete
  using (is_admin());

alter table form_submissions enable row level security;

-- Public visitors can submit a form but can never read submissions back --
-- this is the one table where anonymous INSERT is intentional and SELECT
-- is not.
create policy "Anyone can submit a form"
  on form_submissions for insert
  with check (true);

create policy "Editors and admins can view submissions"
  on form_submissions for select
  using (is_editor_or_admin());

create policy "Editors and admins can update submissions"
  on form_submissions for update
  using (is_editor_or_admin());

create policy "Admins can delete submissions"
  on form_submissions for delete
  using (is_admin());

-- ---------------------------------------------------------------------
-- site_settings
-- ---------------------------------------------------------------------

alter table site_settings enable row level security;

create policy "Anyone can view site settings"
  on site_settings for select
  using (true);

create policy "Admins can update site settings"
  on site_settings for update
  using (is_admin());

-- No insert/delete policy is defined: the single row is created once by
-- migration 20260718100900 and the singleton constraint plus the absence
-- of insert/delete policies means no API caller -- including admins --
-- can create a second row or remove the settings row. This is intentional.

-- ---------------------------------------------------------------------
-- navigation_items
-- ---------------------------------------------------------------------

alter table navigation_items enable row level security;

create policy "Public can view visible navigation items"
  on navigation_items for select
  using (is_visible = true);

create policy "Editors and admins can view all navigation items"
  on navigation_items for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert navigation items"
  on navigation_items for insert
  with check (is_editor_or_admin());

create policy "Editors and admins can update navigation items"
  on navigation_items for update
  using (is_editor_or_admin());

create policy "Admins can delete navigation items"
  on navigation_items for delete
  using (is_admin());

-- ---------------------------------------------------------------------
-- activity_logs (append-only: no update/delete policy for anyone)
-- ---------------------------------------------------------------------

alter table activity_logs enable row level security;

create policy "Admins can view activity logs"
  on activity_logs for select
  using (is_admin());

create policy "Authenticated users can log their own activity"
  on activity_logs for insert
  with check (auth.uid() = user_id or is_admin());

-- ---------------------------------------------------------------------
-- content_revisions (append-only: no update/delete policy for anyone)
-- ---------------------------------------------------------------------

alter table content_revisions enable row level security;

create policy "Editors and admins can view content revisions"
  on content_revisions for select
  using (is_editor_or_admin());

create policy "Editors and admins can insert content revisions"
  on content_revisions for insert
  with check (is_editor_or_admin());
