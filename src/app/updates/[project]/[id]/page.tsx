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
  content_md?: string | null;
  tags?: string[] | null;
  links?: LinkItem[] | null;
};

function isProject(v: string): v is Project {
  return v === "focuspilot" || v === "shiftrix" || v === "linguai";
}

export const revalidate = 60;

export default async function UpdatesDetailPage({
  params,
}: {
  params: { project: string; id: string };
}) {
  const { project: p, id } = params;

  if (!isProject(p)) {
    return (
      <PageShell title="Update" subtitle="Project not found">
        <div className="text-softbrew-mid">Unknown project.</div>
      </PageShell>
    );
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("devlogs")
    .select("id, project, type, status, published_at, date, title, summary, content_md, tags, links")
    .eq("id", id)
    .eq("project", p)
    .eq("type", "devlog")
    .eq("status", "published")
    .single();

  if (error || !data) {
    return (
      <PageShell title="Update" subtitle="Not found">
        <div className="text-softbrew-mid">Not found.</div>
      </PageShell>
    );
  }

  const r = data as Row;

  return (
    <PageShell title={r.title} subtitle={`${p} · ${r.date}`}>
      <GlassCard accent={p} animated={false} className="p-0">
        <div className="p-6 text-white">
          {r.summary ? <p className="opacity-90">{r.summary}</p> : null}

          <div className="mt-5 whitespace-pre-wrap leading-relaxed">
            {r.content_md ?? ""}
          </div>

          {Array.isArray(r.links) && r.links.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-semibold">Links</div>
              <div className="mt-2 flex flex-wrap gap-3">
                {r.links.map((l, i) => (
                  <a
                    key={i}
                    href={l.href}
                    className="underline underline-offset-2 hover:opacity-80"
                  >
                    {l.label} →
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </PageShell>
  );
}
