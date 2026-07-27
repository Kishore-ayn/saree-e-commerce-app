import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/cms/supabase/session";

// Next.js 16 renamed Middleware to Proxy (see AGENTS.md) — same runtime
// behavior, this file replaces what would be middleware.ts pre-16.
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!user && !isLoginRoute) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
