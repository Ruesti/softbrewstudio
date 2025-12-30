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

type CreateBody = {
  project: Project;
  type?: PostType;
  status?: PostStatus;

  date: string;
  title: string;

  summary?: string;      // teaser (optional)
  content_md: string;    // main text (required)

  tags?: string[];
  links?: LinkItem[];
};

export async function POST(req: NextRequest) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Partial<CreateBody>;

    const project = body.project;
    const type: PostType = body.type ?? "devlog";
    const status: PostStatus = body.status ?? "draft";

    if (!project || !body.date || !body.title || !body.content_md) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields (project, date, title, content_md)" },
        { status: 400 }
      );
    }

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });

    const nowIso = new Date().toISOString();

    const insertRow = {
      project,
      type,
      status,
      date: body.date,
      title: String(body.title),
      summary: String(body.summary ?? ""),
      content_md: String(body.content_md),
      tags: body.tags ?? [],
      links: body.links ?? [],
      published_at: status === "published" ? nowIso : null,
      // updated_at handled by DB default/trigger if you add it
    };

    const { data, error } = await supabase.from("devlogs").insert(insertRow).select().single();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
