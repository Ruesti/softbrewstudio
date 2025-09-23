// src/app/api/devlogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Project = "focuspilot" | "shiftrix" | "linguai";
type LinkItem = { label: string; href: string };

type PostBody = {
  project?: Project;
  date?: string;     // YYYY-MM-DD
  title?: string;
  summary?: string;
  tags?: string[];
  links?: LinkItem[];
};

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE env vars.");
  return createClient(url, key, { auth: { persistSession: false } });
}

function isProject(v: unknown): v is Project {
  return v === "focuspilot" || v === "shiftrix" || v === "linguai";
}

function authorized(req: NextRequest): boolean {
  const provided = req.headers.get("x-admin-key") ?? "";
  const expected = process.env.DEVLOG_ADMIN_KEY ?? "";
  return !!provided && !!expected && provided === expected;
}

export async function POST(req: NextRequest) {
  try {
    if (!authorized(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const p = (await req.json()) as PostBody;

    if (!isProject(p.project ?? "")) {
      return NextResponse.json({ ok: false, error: "Ungültiges/fehlendes 'project'." }, { status: 400 });
    }

    const date =
      typeof p.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.date)
        ? p.date
        : new Date().toISOString().slice(0, 10);

    const title = typeof p.title === "string" ? p.title : "";
    const summary = typeof p.summary === "string" ? p.summary : "";
    const tags = Array.isArray(p.tags) ? p.tags.filter((t) => typeof t === "string") : [];
    const links = Array.isArray(p.links)
      ? p.links.filter((l): l is LinkItem => !!l && typeof l.label === "string" && typeof l.href === "string")
      : [];

    const supabase = getClient();
    const { error } = await supabase.from("devlogs").insert({
      project: p.project,
      date,
      title,
      summary,
      tags,
      links,
    });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

