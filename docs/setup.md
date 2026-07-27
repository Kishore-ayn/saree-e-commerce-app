# Supabase Setup

Steps only you can do (they require your Supabase account) to get the CMS
backend running, either for local development or for a new clone of this
repo built for a future client. See the "Reuse Checklist" in
`docs/architecture.md` for how this fits into cloning the whole project.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. Choose a name, database password (save it somewhere safe — you won't be
   asked for it again), and region (pick one close to your users).
3. Wait for provisioning to finish (a couple of minutes).

## 2. Run the migrations

From Project Settings → General, copy the **Project Reference ID**. Then,
from the repository root:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This applies every file in `supabase/migrations/` in order, creating all 20
tables, indexes, triggers, and RLS policies described in
`docs/database-schema.md`.

If you don't have the Supabase CLI linked to Docker locally, `db push` still
works against the hosted project directly — Docker is only required for
`supabase start` (a full local Postgres instance), which is optional.

## 3. Get your API credentials

In the dashboard: **Project Settings → API**.

| Value | Where it's used |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` (server-only, bypasses RLS — keep secret) |

## 4. Configure environment variables

**Local development:**

```bash
cp .env.local.example .env.local
```

Fill in the three values above. `.env.local` is gitignored and never
committed.

**Vercel deployment:**

Project → Settings → Environment Variables. Add the same three variables.
Use different values per environment (Production/Preview/Development) if you
maintain separate Supabase projects for staging vs. production — otherwise
the same values everywhere is fine for a single-project setup.

## 5. Create your first admin user

Migrations create the `profiles` table but no rows — there's no admin user
yet. Until Phase 6 (Authentication UI) adds a sign-up flow, create one
manually:

1. Dashboard → Authentication → Users → Add User (set an email + password).
2. Dashboard → Table Editor → `profiles` → find the row Supabase's own
   trigger... **note:** no such trigger exists yet in this schema — you'll
   need to insert a `profiles` row yourself with that user's `id` and
   `role = 'admin'` until Phase 5 automates this.

## What this phase did NOT do

- Did not create any actual Supabase project — that requires your account
  and is the step above.
- Did not run the migrations anywhere — no `supabase db push` has been
  executed. The very first push against a real Postgres engine is also the
  first full validation of the 2 files (triggers, RLS) that `pg-mem` couldn't
  check in Phase 3 — verify `supabase db push` completes without error before
  trusting those files.
- Did not add a login page, sign-up flow, or session-refresh trigger for
  `profiles` — that's Phase 5/6 (Authentication).
