import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely.
 *
 * DO NOT import this outside lib/cms/users.ts and app/admin/users/actions.ts.
 * Every caller MUST check requireAdmin() (lib/cms/users.ts) before using
 * this client — unlike every other table in this project, RLS provides no
 * backup enforcement here, since this client ignores RLS by design.
 *
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser: no "use client"
 * file, no API response, no client-side bundle may reference it.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
