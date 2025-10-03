import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type Project = "focuspilot" | "shiftrix" | "linguai";
type LinkItem = { label: string; href: string };
type Row = {
  id: string;
  project: Project;
  date: string;
  title: string;
  summary: string;
  tags?: string[];
  links?: LinkItem[];
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectParam = searchParams.get("project");
    const project = (projectParam ?? undefined) as Project | undefined;
    const limit = Number(searchParams.get("limit") ?? "10");

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });

    let query = supabase
      .from("devlogs")
      .select("id, project, date, title, summary, tags, links")
      .order("date", { ascending: false });

    if (project) query = query.eq("project", project);
    if (Number.isFinite(limit) && limit > 0) query = query.limit(limit);

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: (data ?? []) as Row[] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

