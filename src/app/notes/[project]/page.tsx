// src/app/notes/[project]/page.tsx
import Link from "next/link";
import PageShell from "@/components/PageShell";
import GlassCard from "@/components/GlassCard";
import { supabaseServer } from "@/lib/supabaseServer";

type Project = "focuspilot" | "shiftrix" | "linguai";
type LinkItem = { label: string; href: string };

type Row = {
  id: string;
  project: Project;
  type: "devlog" | "note";
  status: "draft" | "published";
  published_at?: string | null;
  date: string;
  title: string;
  summary?: string | null;
  tags?: string[] | null;
};

function isProject(v: string): v is Project {
  return v === "focuspilot" || v === "shiftrix" || v === "linguai";
}

export const revalidate = 60;

export default async function NotesProjectPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;

  if (!isProject(project)) {
    return (
      <PageShell title="Notes" subtitle="Project not found">
        <div className="text-softbrew-mid">Unknown project.</div>
      </PageShell>
    );
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("devlogs")
    .select("id, project, type, status, published_at, date, title, summary, tags")
    .eq("project", project)
    .eq("type", "note")
    .eq("status", "published")
    .order("date", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <PageShell title={`${project} Notes`} subtitle="Could not load notes">
        <div className="text-softbrew-mid">{error.message}</div>
      </PageShell>
    );
  }

  const rows = (data ?? []) as Row[];

  return (
    <PageShell title={`${project} Notes`} subtitle="Published notes">
      <div className="space-y-3">
        {rows.map((r) => (
          <Link key={r.id} href={`/notes/${project}/${r.id}`} className="block">
            <GlassCard accent={project} animated={false} className="p-0">
              <div className="p-5 text-white">
                <div className="text-sm opacity-80">
                  {r.date}
                  {r.tags?.length ? " · " + r.tags.join(" · ") : ""}
                </div>
                <div className="mt-1 font-semibold">{r.title}</div>
                {r.summary ? <p className="mt-2 text-sm opacity-90">{r.summary}</p> : null}
              </div>
            </GlassCard>
          </Link>
        ))}
        {rows.length === 0 && <div className="text-softbrew-mid text-sm">No notes yet.</div>}
      </div>
    </PageShell>
  );
}
