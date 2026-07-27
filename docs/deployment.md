# Deployment

This site deploys to Vercel. `docs/setup.md` covers provisioning the
Supabase project itself — this document is the Vercel side: what env vars
to set, and what's already configured in the codebase versus what still
needs a human to click a button.

## Prerequisites

Before deploying, `docs/setup.md` should already be done: a Supabase
project exists, migrations have been pushed (`supabase db push`), and you
have the project's URL + anon key + service role key.

## Environment variables

Set these in Vercel → Project Settings → Environment Variables (same three
documented in `.env.local.example`):

| Variable | Value | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | **No — server-only** |

Set all three for every environment you use (Production/Preview/Development)
unless you deliberately run separate Supabase projects per environment.

**On the service role key specifically:** it's used in exactly one place —
`lib/cms/supabase/admin.ts`, gated behind the `server-only` package (see
Phase 10.4) and the `requireAdmin()` check in `lib/cms/users.ts`. Vercel
never exposes non-`NEXT_PUBLIC_`-prefixed env vars to the client bundle by
default, so no extra configuration is needed to keep it server-side beyond
what's already in the code — this table is a checklist, not a warning that
something manual is required.

## What's already handled in the codebase (no action needed)

- **Image hosting**: `next.config.ts` already allows `**.supabase.co` in
  `images.remotePatterns` — works for any Supabase project's storage
  hostname without per-deployment edits.
- **Rendering**: the CMS-backed routes (`products/[slug]`,
  `collections/[slug]`, `saree-shop/[area]`, `blog/[slug]`) use
  `dynamicParams: true` (set in Phase 11.2) — Vercel's default ISR behavior
  handles on-demand rendering and caching for slugs that didn't exist at
  build time. No special Vercel configuration required.
- **Build command**: `next build`, Vercel's default for this framework —
  nothing custom needed in Project Settings → Build & Development Settings.
- **Revalidation**: admin Server Actions call `revalidatePath()` after
  writes (see any `app/admin/*/actions.ts`), so published edits appear
  without a redeploy.

## First deploy checklist

1. Push this repository to GitHub (or your git provider of choice) and
   import it in Vercel.
2. Set the three environment variables above.
3. Deploy. The public site will render, but every CMS-backed page shows
   empty/fallback states until content exists.
4. Log in at `/admin/login` with the first admin user created per
   `docs/setup.md` step 5, and enter real content.
5. Re-visit the public pages — on-demand rendering picks up new content
   without a redeploy, per the `dynamicParams: true` behavior above.

## Local pre-deploy verification

Run all three before pushing changes that affect the public site or admin
panel — the same checks CI would run if this project had one (Vercel's
build step covers the equivalent of #3 automatically, but running it
locally first catches issues before they reach a deploy):

```bash
npm run lint
npm test
npm run build
```
