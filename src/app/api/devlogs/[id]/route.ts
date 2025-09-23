// src/app/api/devlogs/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_KEY  = process.env.DEVLOG_ADMIN_KEY!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SB_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function isAuthed(req: Request) {
  return (req.headers.get("x-admin-key") || "") === ADMIN_KEY;
}

const isUUID = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

// PATCH /api/devlogs/[id]
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!params.id || !isUUID(params.id)) {
      return NextResponse.json({ error: `Bad id: ${params.id}` }, { status: 400 });
    }

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });
    const body = await req.json();

    const updates: any = {};
    for (const k of ["project", "date", "title", "summary", "tags", "links"] as const) {
      if (k in body) updates[k] = body[k];
    }

    const { data, error } = await supabase
      .from("devlogs")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected server error" }, { status: 500 });
  }
}

// DELETE /api/devlogs/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!params.id || !isUUID(params.id)) {
      return NextResponse.json({ error: `Bad id: ${params.id}` }, { status: 400 });
    }

    const supabase = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });
    const { error } = await supabase.from("devlogs").delete().eq("id", params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected server error" }, { status: 500 });
  }
}

