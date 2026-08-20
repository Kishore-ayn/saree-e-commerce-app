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

There's no sign-up flow by design (admins are invited, not self-registered
— see Phase 10.4's Users & Roles admin page for inviting everyone after the
first). Bootstrapping the very first admin takes two steps:

1. Dashboard → Authentication → Users → Add User (set an email + password,
   check "Auto Confirm User"). This automatically creates a matching
   `profiles` row with `role = 'editor'` — a trigger added in Phase 10.4
   (`handle_new_user`) does this for every new `auth.users` row, so no
   manual insert is needed here.
2. Promote that row to `role = 'admin'`. **This cannot be done through the
   Table Editor UI or a plain `UPDATE` statement** — a trigger
   (`prevent_self_role_escalation`, Phase 3) blocks any role change that
   isn't made by an existing admin, and there isn't one yet. Run this in
   the Dashboard's **SQL Editor** instead, which can bypass it for one
   statement:
   ```sql
   set session_replication_role = replica;
   update profiles set role = 'admin' where id = '<the new user''s UUID, from the Users page>';
   set session_replication_role = default;
   ```
   Every admin after this first one can be promoted normally through
   Settings → Users in the admin panel itself, signed in as this account.

## Status for this project

Steps 1–5 above have been completed for this deployment: the Supabase
project exists, all 16 migrations are applied (confirmed against the real
Postgres engine — including the trigger/RLS files `pg-mem` couldn't
validate back in Phase 3), `.env.local` is configured, and the first admin
user is created and promoted. This section stays in the doc for the next
clone (per the Reuse Checklist in `docs/architecture.md`), where none of
this will be done yet.
