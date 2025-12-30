import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_KEY = process.env.DEVLOG_ADMIN_KEY!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function isAuthed(req: NextRequest) {
  return (req.headers.get("x-admin-key") || "") === ADMIN_KEY;
}

type Project = "focuspilot" | "shiftrix" | "linguai";
type PostType = "devlog" | "note";

export async function GET(req: NextRequest) {
  try {
    // IMPORTANT: protect admin list (service role key!)
    if (!isAuthed(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectParam = searchParams.get("project");
    const typeParam = searchParams.get("type");
    const limit = Number(searchParams.get("limit") ?? "10");

    const project = (projectParam ?? undefined) as Project | undefined;
    const type = (typeParam ?? undefined) as PostType | undefined;

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });

    let query = supabase
      .from("devlogs")
      .select("id, project, type, status, published_at, date, title, summary, content_md, tags, links")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (project) query = query.eq("project", project);
    if (type) query = query.eq("type", type);
    if (Number.isFinite(limit) && limit > 0) query = query.limit(limit);

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: data ?? [] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
