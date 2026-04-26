import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PRODUCTS = ["focuspilot","shiftrix","linguai"] as const;

export async function POST(req: Request) {
  try {
    const { product, email } = await req.json() as { product: string; email: string };

    if (!product || !(PRODUCTS as readonly string[]).includes(product)) {
      return NextResponse.json({ ok:false, error:"invalid_product" }, { status:400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok:false, error:"invalid_email" }, { status:400 });
    }

    const sb = createClient(SB_URL, SB_SERVICE);
    const { error } = await sb.from("beta_waitlist").insert({ product, email });

    if (error) return NextResponse.json({ ok:false, error:error.message }, { status:500 });

    return NextResponse.json({ ok:true });
  } catch {
    return NextResponse.json({ ok:false, error:"bad_request" }, { status:400 });
  }
}
