import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Create a new instance per request — never module-level singleton — since
 * it's bound to that request's cookies.
 *
 * `setAll` is wrapped in try/catch because Server Components cannot set
 * cookies. When called from a component (not a Server Action), the write is
 * a no-op here; `proxy.ts` refreshes the session cookie on every request
 * instead, so an expired token is still recovered on the next navigation.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — proxy.ts handles refresh.
          }
        },
      },
    }
  );
}
