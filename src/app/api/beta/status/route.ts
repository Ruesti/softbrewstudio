// src/app/api/beta/status/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PRODUCTS = ["focuspilot", "shiftrix", "linguai"] as const;
type Product = typeof PRODUCTS[number];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const product = url.searchParams.get("product") as Product | null;

  if (!product || !PRODUCTS.includes(product)) {
    return NextResponse.json({ ok: false, error: "invalid_product" }, { status: 400 });
  }

  // Kein optional chaining -> maximal kompatibel
  const name = "beta_" + product;
  const cookie = cookies().get(name);
  const authorized = !!cookie && cookie.value === "1";

  return NextResponse.json({ ok: true, authorized });
}
