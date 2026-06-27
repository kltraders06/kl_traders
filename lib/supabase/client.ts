import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Browser / public client — constrained by Row Level Security (anon key).
// Used only for public-facing pages and components.
//
// Lazy singleton for the same reason as admin.ts: Next.js evaluates modules
// during `next build` before env vars are injected. Creating the client
// inside a getter prevents the build from crashing when the vars are absent.

let _browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
    );
  }

  _browserClient = createBrowserClient(url, key);
  return _browserClient;
}

// Proxy so existing callers using `supabase.from(...)` keep working unchanged.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
