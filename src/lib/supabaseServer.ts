import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function supabaseServer() {
  return createClient(SB_URL, SB_ANON, {
    auth: { persistSession: false },
  });
}
