import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only admin client — bypasses RLS entirely.
// NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser.
// Only used inside Next.js API Routes and Server Components (app/api/**, app/admin/**).
//
// Lazy singleton: the client is created on first call, not at module evaluation
// time. This prevents Next.js from crashing during `next build` static analysis
// when the env vars have not been injected yet.

let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  _adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return _adminClient;
}

// Convenience re-export so existing callers keep working without changes.
// Each property access goes through the getter, so the client is never
// instantiated until the code actually runs (i.e. at request time).
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
