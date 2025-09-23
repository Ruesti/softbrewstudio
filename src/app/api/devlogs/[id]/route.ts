// src/app/api/devlogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Project = "focuspilot" | "shiftrix" | "linguai";
type LinkItem = { label: string; href: string };

type PatchBody = Partial<{
  project: Project;
  date: string;     // YYYY-MM-DD
  title: string;
  summary: string;
  tags: string[];
  links: LinkItem[];
}>;

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE env vars.");
  return createClient(url, key, { auth: { persistSession: false } });
}

function isUUID(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}
function isProject(v: unknown): v is Project {
  return v === "focuspilot" || v === "shiftrix" || v === "linguai";
}
function authorized(req: NextRequest): boolean {
  const provided = req.headers.get("x-admin-key") ?? "";
  const expected = process.env.DEVLOG_ADMIN_KEY ?? "";
  return !!provided && !!expected && provided === expected;
}

// Optional: Einzel-GET
export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!isUUID(id)) return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });

    const supabase = getClient();
    const { data, error } = await supabase
      .from("devlogs")
      .select("id, project, date, title, summary, tags, links, created_at")
      .eq("id", id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    if (!authorized(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const id = ctx.params.id;
    if (!isUUID(id)) return NextResponse.json({ ok: false, error: "Ungültige ID." }, { status: 400 });

    const p = (await req.json()) as PatchBody;
    const patch: Record<string, unknown> = {};

    if (p.project !== undefined) {
      if (!isProject(p.project)) return NextResponse.json({ ok: false, error: "Ungültiges 'project'." }, { status: 400 });
      patch.project = p.project;
    }
    if (p.date !== undefined) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) return NextResponse.json({ ok: false, error: "Ungültiges 'date'." }, { status: 400 });
      patch.date = p.date;
    }
    if (p.title !== undefined) patch.title = String(p.title);
    if (p.summary !== undefined) patch.summary = String(p.summary);
    if (p.tags !== undefined) {
      if (!Array.isArray(p.tags) || !p.tags.every((t) => typeof t === "string"))
        return NextResponse.json({ ok: false, error: "Ungültige 'tags'." }, { status: 400 });
      patch.tags = p.tags;
    }
    if (p.links !== undefined) {
      if (!Array.isArray(p.links) || !p.links.every((l) => !!l && typeof l.label === "string" && typeof l.href === "string"))
        return NextResponse.json({ ok: false, error: "Ungültige 'links'." }, { status: 400 });
      patch.links = p.links;
    }

    if (Object.keys(patch).length === 0)
      return NextResponse.json({ ok: false, error: "Kein Feld zum Aktualisieren." }, { status: 400 });

    const supabase = getClient();
    const { error } = await supabase.from("devlogs").update(patch).eq("id", id);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    if (!authorized(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const id = ctx.params.id;
    if (!isUUID(id)) return NextResponse.json({ ok: false, error: "Ungültige ID." }, { status: 400 });

    const supabase = getClient();
    const { error } = await supabase.from("devlogs").delete().eq("id", id);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

