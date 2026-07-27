import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components (admin UI interactivity only —
 * e.g. a media upload progress bar). Server Components and Server Actions
 * must use `lib/cms/supabase/server.ts` instead so RLS sees the request's
 * actual session cookie.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
