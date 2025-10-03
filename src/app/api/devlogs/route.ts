import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_KEY  = process.env.DEVLOG_ADMIN_KEY!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SB_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function isAuthed(req: NextRequest) {
  return (req.headers.get("x-admin-key") || "") === ADMIN_KEY;
}

type Project = "focuspilot" | "shiftrix" | "linguai";
type LinkItem = { label: string; href: string };
type CreateBody = {
  project: Project;
  date: string;
  title: string;
  summary: string;
  tags?: string[];
  links?: LinkItem[];
};

export async function POST(req: NextRequest) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Partial<CreateBody>;

    if (!body.project || !body.date || !body.title || !body.summary) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });

    const insertRow: CreateBody = {
      project: body.project,
      date: body.date,
      title: String(body.title),
      summary: String(body.summary),
      tags: body.tags ?? [],
      links: body.links ?? [],
    };

    const { data, error } = await supabase
      .from("devlogs")
      .insert(insertRow)
      .select()
      .single();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

