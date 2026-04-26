import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const PRODUCTS = ["focuspilot","shiftrix","linguai"] as const;
type Product = typeof PRODUCTS[number];

export async function POST(req: Request) {
  try {
    const { product, password } = await req.json() as { product: Product; password: string };

    if (!product || !PRODUCTS.includes(product)) {
      return NextResponse.json({ ok:false, error:"invalid_product" }, { status:400 });
    }
    if (!password) {
      return NextResponse.json({ ok:false, error:"missing_password" }, { status:400 });
    }

    const sb = createClient(SB_URL, SB_SERVICE);
    const { data, error } = await sb.from("beta_passwords").select("password").eq("product", product).single();

    if (error || !data) {
      return NextResponse.json({ ok:false, error:"server_misconfigured" }, { status:500 });
    }

    // MVP: Plaintext-Vergleich (später Hash/ bcrypt)
    if (password !== data.password) {
      return NextResponse.json({ ok:false, error:"invalid_password" }, { status:401 });
    }

    const res = NextResponse.json({ ok:true, message:"authorized" });
    res.cookies.set(`beta_${product}`, "1", {
      path:"/",
      httpOnly:true,
      sameSite:"lax",
      secure:false,           // lokal false; auf Vercel true setzen
      maxAge: 60*60*24*14,    // 14 Tage
    });
    return res;
  } catch (e) {
    return NextResponse.json({ ok:false, error:"bad_request" }, { status:400 });
  }
}
