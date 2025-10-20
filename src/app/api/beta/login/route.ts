// src/app/api/beta/login/route.ts
import { NextResponse } from "next/server";

const PRODUCTS = ["focuspilot", "shiftrix", "linguai"] as const;

export async function POST(req: Request) {
  try {
    const { product, password } = await req.json();

    // 1. Validierung
    if (!product || !PRODUCTS.includes(product)) {
      return NextResponse.json({ ok: false, error: "invalid_product" }, { status: 400 });
    }

    // 2. Einfaches Demo-Passwort (später: env)
    const DEMO_PASSWORD = "test123";
    if (password !== DEMO_PASSWORD) {
      return NextResponse.json({ ok: false, error: "invalid_password" }, { status: 401 });
    }

    // 3. Cookie setzen
    const res = NextResponse.json({ ok: true, message: "authorized" });
    res.cookies.set(`beta_${product}`, "1", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false,   // ⚠️ lokal false, auf Vercel true setzen
      maxAge: 60 * 60 * 24 * 14, // 14 Tage
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 500 });
  }
}
