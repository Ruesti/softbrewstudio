// src/app/notes/page.tsx
import PageShell from "@/components/PageShell";
import DevlogList from "@/components/DevlogList";
import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";

type LinkItem = { label: string; href: string };

// Matches DevlogList expectations (tags/links should be undefined, not null)
type NoteRow = {
  date: string;
  title: string;
  summary: string;
  tags?: string[];
  links?: LinkItem[];
};

async function fetchTop(
  project: "focuspilot" | "shiftrix" | "linguai",
  n = 3
): Promise<NoteRow[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("devlogs")
    .select("date,title,summary,tags,links")
    .eq("project", project)
    .eq("type", "note")
    .eq("status", "published")
    .order("date", { ascending: false })
    .limit(n);

  if (error) throw error;

  // normalize nullable columns (Supabase may return null)
  return ((data ?? []) as Array<{
    date: string;
    title: string;
    summary: string;
    tags?: string[] | null;
    links?: LinkItem[] | null;
  }>).map((r) => ({
    date: r.date,
    title: r.title,
    summary: r.summary,
    tags: r.tags ?? undefined,
    links: r.links ?? undefined,
  }));
}

export default async function NotesPage() {
  const [fp, sx, la] = await Promise.all([
    fetchTop("focuspilot", 3),
    fetchTop("shiftrix", 3),
    fetchTop("linguai", 3),
  ]);

  return (
    <PageShell title="Notes" subtitle="Gedanken, Fragen & Themen – gesammelt bei Softbrew Studio.">
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        <GlassCard accent="focuspilot" animated={false} className="p-0">
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-2">FocusPilot</h2>
            <DevlogList items={fp} />
            <div className="mt-4">
              <Link
                href="/notes/focuspilot"
                className="inline-flex items-center gap-1 rounded-lg border border-white/70 px-3 py-2 text-white hover:bg-white/10 active:bg-white/15"
              >
                Alle Notes →
              </Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard accent="shiftrix" animated={false} className="p-0">
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-2">Shiftrix</h2>
            <DevlogList items={sx} />
            <div className="mt-4">
              <Link
                href="/notes/shiftrix"
                className="inline-flex items-center gap-1 rounded-lg border border-white/70 px-3 py-2 text-white hover:bg-white/10 active:bg-white/15"
              >
                Alle Notes →
              </Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard accent="linguai" animated={false} className="p-0">
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-2">LinguAI</h2>
            <DevlogList items={la} />
            <div className="mt-4">
              <Link
                href="/notes/linguai"
                className="inline-flex items-center gap-1 rounded-lg border border-white/70 px-3 py-2 text-white hover:bg-white/10 active:bg-white/15"
              >
                Alle Notes →
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
