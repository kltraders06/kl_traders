import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function withAuthCookies(response: NextResponse, authResponse: NextResponse) {
  authResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  authResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      response.headers.set(key, value);
    }
  });

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function proxy(request: NextRequest) {
  let authResponse = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (path.startsWith("/api/admin")) {
      return NextResponse.json(
        { success: false, error: "Supabase auth is not configured." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        authResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          authResponse.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => {
          authResponse.headers.set(key, value);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && path.startsWith("/api/admin")) {
    return withAuthCookies(
      NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      ),
      authResponse
    );
  }

  if (!user && path !== "/admin/login") {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("next", path);
    return withAuthCookies(NextResponse.redirect(redirectUrl), authResponse);
  }

  if (user && path === "/admin/login") {
    return withAuthCookies(NextResponse.redirect(new URL("/admin", request.url)), authResponse);
  }

  return authResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
