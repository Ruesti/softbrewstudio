// src/app/api/devlogs/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Project = "focuspilot" | "shiftrix" | "linguai";
type LinkItem = { label: string; href: string };
type DevlogRow = {
  id: string;
  project: Project;
  date: string;
  title: string;
  summary: string;
  tags?: string[];
  links?: LinkItem[];
};

type RowFromDB = {
  id: string;
  project: Project | null;
  date: string | null;
  title: string | null;
  summary: string | null;
  tags: string[] | null;
  links: LinkItem[] | null;
  created_at: string;
};

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE env vars.");
  return createClient(url, key, { auth: { persistSession: false } });
}

function isProject(v: string | null): v is Project {
  return v === "focuspilot" || v === "shiftrix" || v === "linguai";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const project = searchParams.get("project");
    const n = Number(searchParams.get("limit"));
    const limit = Number.isFinite(n) ? Math.max(1, Math.min(100, n)) : 10;

    if (!isProject(project)) {
      return NextResponse.json({ error: "Parameter 'project' fehlt/ungültig." }, { status: 400 });
    }

    const supabase = getClient();
    const { data, error } = await supabase
      .from("devlogs")
      .select("id, project, date, title, summary, tags, links, created_at")
      .eq("project", project)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const rows: DevlogRow[] = ((data ?? []) as RowFromDB[]).map((r) => ({
      id: r.id,
      project: (r.project ?? project) as Project,
      date:
        r.date && r.date.length >= 10
          ? r.date
          : new Date(r.created_at).toISOString().slice(0, 10),
      title: r.title ?? "",
      summary: r.summary ?? "",
      tags: r.tags ?? undefined,
      links: r.links ?? undefined,
    }));

    return NextResponse.json({ data: rows });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

