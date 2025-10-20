import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "10", 10), 50);
  const project = url.searchParams.get("project");

  const sb = createClient(SB_URL, SB_SERVICE);

  let q = sb
    .from("devlogs")
    .select("id, date, project, title, summary, tags, links")
    .order("date", { ascending: false })
    .limit(limit);

  if (project) q = q.eq("project", project);

  const { data, error } = await q;
  if (error) return new NextResponse(error.message, { status: 500 });

  // 👉 Spalten vereinheitlichen
  const mapped = (data ?? []).map((d) => ({
    ...d,
    created_at: d.date,
    body: d.summary,
  }));

  return NextResponse.json(mapped);
}
