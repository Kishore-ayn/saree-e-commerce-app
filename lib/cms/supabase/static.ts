import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anon-key Supabase client with no cookie/session dependency. Used by the
 * public-facing read functions in lib/cms/{products,collections,areas,blog}.ts
 * — these only ever read published, publicly-visible rows, so they don't
 * need a user session, and calling cookies() (via the SSR client in
 * lib/cms/supabase/server.ts) is disallowed inside generateStaticParams
 * anyway, which runs at build time with no request context.
 */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
