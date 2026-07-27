# Database Schema

Status: migrations written, **not yet applied to any Supabase project** (that is
Phase 4). This document is the reference for the schema those migrations create.
See `docs/architecture.md` for the reasoning behind the hybrid content model this
schema implements.

## Migration files

All schema changes live in `supabase/migrations/`, applied in filename order:

| File | Contents |
|---|---|
| `20260718100000_extensions_and_enums.sql` | `pgcrypto` extension, shared `content_status` enum |
| `20260718100100_profiles_and_media.sql` | `profiles`, `media` |
| `20260718100200_pages_and_sections.sql` | `pages`, `page_sections` |
| `20260718100300_collections.sql` | `collections`, `collection_related_collections` |
| `20260718100400_products.sql` | `products`, `product_collections`, `product_media` |
| `20260718100500_areas_and_faqs.sql` | `areas`, `area_collections`, `faqs` |
| `20260718100600_blog.sql` | `blog_posts`, `blog_post_collections` |
| `20260718100700_testimonials.sql` | `testimonials` |
| `20260718100800_forms.sql` | `forms`, `form_submissions` |
| `20260718100900_site_settings_and_navigation.sql` | `site_settings`, `navigation_items` |
| `20260718101000_activity_logs_and_revisions.sql` | `activity_logs`, `content_revisions` |
| `20260718101100_updated_at_triggers.sql` | shared `set_updated_at()` trigger, applied to every mutable table |
| `20260718101200_rls_policies.sql` | `is_admin()` / `is_editor_or_admin()` helpers, RLS enabled + policies on every table |

**Validation status:** the first 11 files were executed successfully against an
in-memory Postgres-compatible engine (`pg-mem`) during authoring, confirming
syntax and referential correctness (foreign keys resolve, types exist before use,
no naming collisions). The last 2 files (`plpgsql` trigger functions, `security
definer` functions, and RLS policies) use features that lightweight emulator
doesn't implement — those were reviewed manually against standard, documented
Supabase patterns instead. **Full execution against a real Postgres instance
happens in Phase 4**, when a Supabase project exists to run `supabase db push`
against (no Docker was available in this environment to run `supabase start`
locally beforehand).

## Naming convention

Table names mirror existing `lib/types.ts` interfaces where one already exists
(`products`, `collections`, `areas`, `blog_posts`) rather than being renamed to
more abstract terms — see `docs/architecture.md` section 2 for the reasoning.
Tables with no existing interface (media, forms, settings, navigation, logs,
revisions) were named freely.

## Tables

### Identity

**`profiles`** — one row per `auth.users.id`. `role` is `'admin' | 'editor'`.
A trigger (`prevent_self_role_escalation`) blocks a non-admin from changing
their own `role` even via a direct API call.

### Media

**`media`** — metadata for admin-uploaded files (Supabase Storage). `file_type`
is `'image' | 'video' | 'pdf'`. No `url` column — public URLs are derived from
`storage_path` at read time. Entirely separate from the existing
`public/images/*` build-time pipeline, which is untouched.

### Pages (generic content model)

**`pages`** — section-driven marketing pages. `template` (`'home' | 'standard' |
'landing'`) selects which Next.js layout renders it.

**`page_sections`** — ordered content blocks within a page. `section_type`
(`'hero' | 'about' | 'faq' | 'testimonials' | 'gallery' | 'cta' | 'custom'`) plus
a `data jsonb` payload whose shape is validated by a TypeScript discriminated
union at the application layer, not the database.

### Collections

**`collections`** — first-class grouping entity (product collections here;
reusable as service categories elsewhere). Flat, no hierarchy (matches the
existing `Collection` interface, which has none).

**`collection_related_collections`** — directed "see also" links.

### Products

**`products`** — `kind` (`'product' | 'service'`) lets one table serve both
physical products and services without duplication. `attributes jsonb` holds
business-specific variable fields (e.g. `fabric`, `colors`, `occasions` for this
site) instead of hardcoded columns; a GIN index supports future containment
queries.

**`product_collections`** — many-to-many join.

**`product_media`** — ordered image gallery join table (`position`,
`alt_text_override`).

### Areas (local SEO)

**`areas`** — neighbourhood landing pages, generic in structure.

**`area_collections`** — many-to-many join.

**`faqs`** — individually editable FAQ entries. `area_id` null = global FAQ;
set = scoped to that area.

### Blog

**`blog_posts`** — `content` is markdown (replacing the previous bespoke
`"## Heading"` string-array convention).

**`blog_post_collections`** — many-to-many join.

### Testimonials

**`testimonials`** — standalone, universal content type.

### Forms

**`forms`** — form schema definitions (`fields jsonb`), so a new form doesn't
need a migration.

**`form_submissions`** — `form_id` uses `ON DELETE RESTRICT` (a form definition
can't be deleted while submissions reference it). Public can `INSERT` but never
`SELECT` — see RLS below.

### Site-wide settings

**`site_settings`** — single row (`id` constrained to `1`), covering business
info, hours, social links, theme colors, analytics IDs, default SEO. Maps
closely to the existing `lib/site-config.ts` shape. No insert/delete policy
exists for any role — the row is permanent once created by this migration.

**`navigation_items`** — header + footer links in one table (`location`
discriminates), self-referencing `parent_id` for nested/mega-menu structures.

### Audit & versioning

**`activity_logs`** — append-only audit trail (`action`, `entity_type`,
`entity_id`, `metadata`).

**`content_revisions`** — generic version history, `(entity_type, entity_id,
version_number)` uniquely identifies a snapshot. A new content type gets
versioning for free by writing here on save; rollback restores a snapshot as a
*new* revision, never destructively.

## Draft / Publish

Every editorial content table has `status content_status` (`'draft' |
'published'`). No separate shadow tables — public reads always filter
`status = 'published'`; the admin panel reads/writes regardless of status.
Simple visibility toggles that aren't an editorial workflow (`navigation_items`,
`forms`) use a plain boolean (`is_visible`, `is_active`) instead.

## Row Level Security

Enabled on every table. Two helper functions, `is_admin()` and
`is_editor_or_admin()`, both `security definer` (so they can check `profiles`
regardless of the calling role's own visibility into that table).

General pattern for public-facing content tables: two permissive `SELECT`
policies — one for "public sees published/visible/active rows", one for
"editors and admins see everything" — which Postgres combines with `OR`. Writes
are `editor_or_admin`; deletes are `admin`-only. Join tables (no `status` of
their own) are publicly readable and staff-writable, since the parent table's
filter already gates what's actually reachable through a join. Two deliberate
exceptions: `form_submissions` allows public `INSERT` but no public `SELECT`
(visitors submit, only staff read); `site_settings` and the singleton pattern
have no insert/delete policy for anyone, protecting the one-row invariant.

Full policy definitions are in `20260718101200_rls_policies.sql` — see that
file directly for the exact SQL per table rather than duplicating it here.

## Not yet decided / deferred

- Exact final role set (`admin`/`editor` now; `viewer` under consideration) —
  confirmed in Phase 5 (Authentication).
- Whether `content_revisions` writes happen via application-layer code (in the
  Server Action) or a database trigger — a decision for Phase 8 (Content
  Management), noted in `docs/architecture.md`.
