// src/app/api/devlogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_KEY  = process.env.DEVLOG_ADMIN_KEY!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SB_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function isAuthed(req: NextRequest) {
  return (req.headers.get("x-admin-key") || "") === ADMIN_KEY;
}

const isUUID = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

type LinkItem = { label: string; href: string };
type PatchBody = {
  project?: "focuspilot" | "shiftrix" | "linguai";
  date?: string;
  title?: string;
  summary?: string;
  tags?: string[];
  links?: LinkItem[];
};

// GET /api/devlogs/[id]
export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    if (!isUUID(id)) return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("devlogs")
      .select("id, project, date, title, summary, tags, links, created_at")
      .eq("id", id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH /api/devlogs/[id]
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { id } = context.params;
    if (!isUUID(id)) return NextResponse.json({ ok: false, error: "Ungültige ID." }, { status: 400 });

    const body: PatchBody = await req.json();
    const patch: Partial<PatchBody> = {};
    if (body.project !== undefined) patch.project = body.project;
    if (body.date !== undefined) patch.date = body.date;
    if (body.title !== undefined) patch.title = String(body.title);
    if (body.summary !== undefined) patch.summary = String(body.summary);
    if (body.tags !== undefined) patch.tags = body.tags;
    if (body.links !== undefined) patch.links = body.links;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: false, error: "Kein Feld zum Aktualisieren." }, { status: 400 });
    }

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });
    const { error } = await supabase.from("devlogs").update(patch).eq("id", id);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

// DELETE /api/devlogs/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { id } = context.params;
    if (!isUUID(id)) return NextResponse.json({ ok: false, error: "Ungültige ID." }, { status: 400 });

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });
    const { error } = await supabase.from("devlogs").delete().eq("id", id);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

