// src/app/api/devlogs/list/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // frische Antworten im dev

const SB_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(req: Request) {
  try {
    if (!SB_URL || !SB_ANON) {
      return NextResponse.json({ error: "Supabase env missing (URL or ANON)" }, { status: 500 });
    }

    const { searchParams } = new globalThis.URL(req.url);
    const project = searchParams.get("project");        // optional: "focuspilot" | "shiftrix" | "linguai"
    const limit   = Number(searchParams.get("limit") || 10);

    const supabase = createClient(SB_URL, SB_ANON, { auth: { persistSession: false } });

    let q = supabase
      .from("devlogs")
      .select("id,project,date,title,summary,tags,links")
      .order("date", { ascending: false })
      .limit(limit);

    if (project) q = q.eq("project", project);

    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected server error" }, { status: 500 });
  }
}

