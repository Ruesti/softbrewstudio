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
type PostStatus = "draft" | "published";
type LinkItem = { label: string; href: string };

type PatchBody = Partial<{
  project: Project;
  type: PostType;
  status: PostStatus;

  date: string;
  title: string;
  summary: string;
  content_md: string;

  tags: string[];
  links: LinkItem[];
}>;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const body = (await req.json()) as PatchBody;

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });

    // If switching to published, set published_at if not already set
    let published_at: string | null | undefined = undefined;
    if (body.status === "published") {
      const { data: current, error: curErr } = await supabase
        .from("devlogs")
        .select("published_at")
        .eq("id", id)
        .single();

      if (curErr) return NextResponse.json({ ok: false, error: curErr.message }, { status: 400 });

      if (!current?.published_at) {
        published_at = new Date().toISOString();
      }
    }

    const updateRow: Record<string, unknown> = {};
    const allowed: (keyof PatchBody)[] = [
      "project",
      "type",
      "status",
      "date",
      "title",
      "summary",
      "content_md",
      "tags",
      "links",
    ];

    for (const k of allowed) {
      if (typeof body[k] !== "undefined") updateRow[k] = body[k];
    }

    if (typeof published_at !== "undefined") {
      updateRow.published_at = published_at;
    }

    const { data, error } = await supabase
      .from("devlogs")
      .update(updateRow)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });

    const { error } = await supabase.from("devlogs").delete().eq("id", id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
