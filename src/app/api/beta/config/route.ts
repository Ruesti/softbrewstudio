import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const PRODUCTS = ["focuspilot","shiftrix","linguai"] as const;
type Product = typeof PRODUCTS[number];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const product = url.searchParams.get("product") as Product | null;

  if (!product || !PRODUCTS.includes(product)) {
    return NextResponse.json({ ok:false, error:"invalid_product" }, { status:400 });
  }

  const sb = createClient(SB_URL, SB_SERVICE);
  const { data, error } = await sb.from("beta_settings").select("state").eq("product", product).single();

  if (error && error.code !== "PGRST116") { // 116 = not found
    return NextResponse.json({ ok:false, error:error.message }, { status:500 });
  }

  const state = data?.state ?? "open"; // default
  return NextResponse.json({ ok:true, product, state });
}
