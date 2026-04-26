import { NextResponse } from "next/server";

const ADMIN_KEY = process.env.ADMIN_KEY || "supergeheim";

export async function GET(req: Request) {
  const key = req.headers.get("x-admin-key");
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }

  // Beispiel-Daten (später aus DB)
  const data = [
    { product: "focuspilot", status: "coming_soon", password: "test123" },
    { product: "shiftrix", status: "open", password: "beta456" },
    { product: "linguai", status: "coming_soon", password: "beta789" },
  ];

  return NextResponse.json({ ok: true, data });
}
