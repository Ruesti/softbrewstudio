// src/app/api/devlogs/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_KEY  = process.env.DEVLOG_ADMIN_KEY!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SB_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function POST(req: Request) {
  try {
    const sentKey = req.headers.get("x-admin-key") || "";
    if (sentKey !== ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });

    const payload = {
      project: body.project,   // "focuspilot" | "shiftrix" | "linguai"
      date: body.date,         // "YYYY-MM-DD"
      title: body.title,
      summary: body.summary,
      tags: Array.isArray(body.tags) ? body.tags : [],
      links: Array.isArray(body.links) ? body.links : [],
    };

    const { data, error } = await supabase.from("devlogs").insert(payload).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected server error" }, { status: 500 });
  }
}

