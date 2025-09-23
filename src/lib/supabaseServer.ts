// src/lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase Client (lesen via anon key)
 */
export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, { auth: { persistSession: false } });
}
