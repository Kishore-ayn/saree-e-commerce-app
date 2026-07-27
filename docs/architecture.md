# CMS Architecture

Status: **implemented** (approved Phase 2; Phases 3–12 built the schema, admin
panel, and public-site integration described below — see the Reuse Checklist
at the end of this document for what's actually in place today)
Reuse model: **clone-per-project**. Each new client website is a fresh clone of this
repository, its own Supabase project, its own Vercel deployment. This document
describes the *architecture* that gets cloned, not a running multi-tenant service.

This document is the reference for every phase after it. If a later phase needs to
deviate from a decision recorded here, that deviation gets explained and approved
the same way the original decision was, then this file gets updated.

---

## 1. Rendering Strategy

**Public site stays statically generated. Content becomes editable without a full
rebuild via on-demand revalidation.**

- Every content-backed route (`/products/[slug]`, `/collections/[slug]`,
  `/saree-shop/[area]`, `/blog/[slug]`) keeps `generateStaticParams()` to pre-render
  known content at build time.
- `export const dynamicParams = false` is relaxed to `true` (or omitted — that's the
  Next.js default) so a slug created *after* the last build still renders — Next.js
  generates it on first request and caches the result from then on.
- Admin Server Actions call `revalidatePath()` (or `revalidateTag()` for
  cross-cutting content like site-wide settings) immediately after a successful
  write, so a saved edit is visible to the next visitor within seconds — no redeploy.
- Anonymous traffic never hits the database directly. Every public page read is
  served from Next.js's static/ISR cache, matching the performance profile the site
  already has today.

**Accepted trade-off:** with `dynamicParams: true`, requesting an unknown or
mistyped slug triggers one render attempt before falling through to `notFound()`,
instead of an instant 404 at the routing layer. Every page component already calls
`notFound()` when its data lookup misses, so behavior is correct — just marginally
less cheap for the not-found case. This is judged an acceptable trade for editable
content and applies at Phase 11 (Website Integration), not before.

## 2. Content Model Philosophy

**Hybrid: first-class tables for structural, cross-vertical concepts; a generic
section/block table for free-form marketing copy.**

Considered and rejected:
- **Pure per-content-type tables** (a `products` table, a `services` table, a
  `team_members` table, one per business concept as it comes up) — matches today's
  code almost exactly, but doesn't generalize. A future landscaping client's
  "Services" and this boutique's "Products" are conceptually the same *shape*
  (name, price, description, image, category) and should share a schema.
- **Fully generic** (one `pages` table, one `blocks` table, everything as JSON
  payloads) — maximally reusable, but throws away real columns, foreign keys,
  and indexes for data that genuinely has structure (a product has a numeric
  price you want to sort/filter by; that shouldn't live inside a JSON blob).

Decision: structural, recurring business entities (products/offerings,
testimonials, FAQs, team members, gallery items) get real tables with typed
columns and indexes. Content that is inherently free-form and varies most between
businesses (hero headline/subtext/CTA, about-page copy, footer columns) lives in a
generic `page_sections` table: `(page, section_type, position, data jsonb,
status)`. The exact table list and columns are Phase 3's deliverable — this section
fixes the *philosophy*, not the schema.

## 3. Data Access Layer

**A `lib/cms/` module of server-only async functions with the exact same return
shapes as today's `data/*.ts` exports**, so integrating the CMS into existing pages
is a mechanical, minimal-diff change:

```ts
// today
import { products } from "@/data/products";

// after Phase 11
import { getProducts } from "@/lib/cms/products";
const products = await getProducts();
```

- Return types are the existing `lib/types.ts` interfaces (`Product`, `Collection`,
  `Area`, `BlogPost`) — Supabase row shapes are mapped into these *inside*
  `lib/cms/`, never leaked into components. No component needs to know Supabase
  exists.
- Page components that aren't already `async` become `async` to `await` these
  calls; JSX and prop shapes do not change.

## 4. Authentication & Role-Based Access

- Supabase Auth (email/password to start) via `@supabase/ssr` for cookie-based
  sessions usable from Server Components, Server Actions, and middleware.
- A `profiles` table, one row per `auth.users.id`, carries a `role` enum
  (`admin`, `editor` at minimum — `viewer` under consideration for read-only
  client preview access, confirmed in Phase 5).
- Role-Level Security (RLS) policies check the `profiles.role` of the requesting
  user — never a client-supplied claim — so authorization is enforced at the
  database layer, not just in UI logic.
- `middleware.ts` at the project root guards `/admin/*`, redirecting
  unauthenticated requests to `/admin/login`.

## 5. Media Strategy

- **`public/images/*` is untouched.** It is build-time content specific to this
  site's current design (categories, occasions, hero, per-product photography),
  already working, and out of scope for migration. It is a "never touch" area
  per the Phase 1 report.
- **New media uploaded through the admin Media Library goes to Supabase
  Storage**, tracked in a `media` table (storage path, public URL, alt text,
  mime type, file size, width/height, `uploaded_by`, `created_at`). This table is
  the single source of truth for anything uploaded via the CMS from this point
  forward — a separate, parallel system to the existing static image pipeline,
  not a replacement for it.
- `next.config.ts` gets the Supabase Storage hostname added to
  `images.remotePatterns` once Phase 4 provisions the project (additive,
  low-risk, one line).

## 6. Folder Structure

```
app/
  admin/                      # new route group, gated by middleware.ts
    layout.tsx                # admin shell: sidebar, topbar, auth guard
    login/page.tsx
    dashboard/page.tsx
    products/                 # list, [id]/edit, new
    collections/
    pages/                    # hero / about / footer / nav section editors
    media/page.tsx
    forms/page.tsx            # submitted form entries
    settings/
      business/page.tsx       # phone, address, hours, social
      theme/page.tsx
      seo/page.tsx
      users/page.tsx          # admin-only

  # existing routes: unchanged

lib/
  cms/                        # new, server-only data access (section 3)
    products.ts
    collections.ts
    pages.ts
    media.ts
    supabase/
      client.ts               # browser client (admin UI interactivity only)
      server.ts               # server component / Server Action client
      middleware.ts           # session-refresh helper used by middleware.ts
  types.ts                     # extended in place, never replaced

middleware.ts                  # new, root-level

supabase/
  migrations/                  # every schema change, Phase 3 onward — no manual SQL
  seed.sql                     # optional local-dev seed data

docs/
  architecture.md               # this file
  database-schema.md            # Phase 3 output
  setup.md                      # Phase 4 output
```

Nothing in the existing `app/`, `components/`, `data/`, or `lib/` (outside the new
`lib/cms/` subdirectory) moves or is renamed as part of this architecture.

---

## Standing Risks (tracked across phases)

- **`dynamicParams` change** (section 1) — applied in Phase 11.2 as planned.
- **Content model hybrid** (section 2) — implemented table-by-table across
  Phase 3, per the reasoning in that phase's report.
- ~~No test runner exists yet~~ — resolved in Phase 12 (`vitest`, unit tests
  for the CMS row-mapping functions and other pure logic).
- **Theme colors aren't wired to the live site** — `site_settings.theme`
  (Phase 10.2) is saved but not read anywhere; `app/globals.css` is still
  the real source of brand colors. Noted in the Reuse Checklist below;
  unbuilt follow-up work, not scoped to any phase so far.
- **No generated Supabase types** — the client isn't parameterized with a
  `Database` type (noted in Phase 7/8.3 reports), so a few spots use
  `as unknown as` casts around Supabase's loose default typing. Safe today
  (verified via tests and manual review) but worth closing with
  `supabase gen types typescript` once a real project exists to generate
  against.

---

## Reuse Checklist (for future clients — the CMS is now fully built, Phases 3–12)

Updated after Phase 13 to match what actually exists, rather than what was
planned back in Phase 2. Full detail for each step: `docs/setup.md` (steps
1–5) and `docs/deployment.md` (step 8).

1. Clone this repository.
2. Create a new Supabase project; run `supabase db push` against it.
3. Configure environment variables (Supabase URL/keys) locally and in Vercel.
4. Create the first admin user (manual — `docs/setup.md` step 5; every user
   after that can be invited from the admin panel itself, Phase 10.4).
5. Replace branding: `lib/site-config.ts` values and logo assets directly.
   **Note:** Settings → Theme in the admin panel (Phase 10.2) saves color
   values to `site_settings.theme`, but nothing reads them back into the
   live site yet — `app/globals.css`'s CSS custom properties are still the
   actual mechanism. Wiring the saved theme into the live stylesheet is
   unbuilt follow-up work, not a Phase 13 deliverable.
6. Enter content through the admin panel. There is no seed script —
   `supabase/seed.sql` was planned in this document back in Phase 2 but was
   never built; content entry is manual through the admin UI.
7. Point `next.config.ts`'s `images.remotePatterns` at nothing extra — the
   `**.supabase.co` wildcard already covers any project.
8. Deploy to Vercel — see `docs/deployment.md`.

No CMS architecture changes required for a new client — only content,
branding, and configuration (steps 2–8 above).
