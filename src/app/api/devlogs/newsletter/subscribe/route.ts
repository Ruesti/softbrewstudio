import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  const { email, product } = await req.json();
  if (!email) return new NextResponse("Keine E-Mail", { status: 400 });

  const sb = createClient(SB_URL, SB_SERVICE);
  const { error } = await sb.from("newsletter_subscribers").insert({
    email: email.trim().toLowerCase(),
    product,
  });
  if (error) return new NextResponse(error.message, { status: 500 });

  return new NextResponse("OK");
}
