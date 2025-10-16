// src/app/updates/page.tsx
import PageShell from "@/components/PageShell";
import DevlogList from "@/components/DevlogList";
import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
// RICHTIG
import GlassCard from "@/components/GlassCard";


type LinkItem = { label: string; href: string };
type DevlogRow = {
  date: string;
  title: string;
  summary: string;
  tags?: string[];
  links?: LinkItem[];
};

async function fetchTop(
  project: "focuspilot" | "shiftrix" | "linguai",
  n = 3
): Promise<DevlogRow[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("devlogs")
    .select("date,title,summary,tags,links")
    .eq("project", project)
    .order("date", { ascending: false })
    .limit(n);

  if (error) throw error;
  return (data ?? []) as DevlogRow[];
}

export default async function UpdatesPage() {
  const [fp, sx, la] = await Promise.all([
    fetchTop("focuspilot", 3),
    fetchTop("shiftrix", 3),
    fetchTop("linguai", 3),
  ]);

  return (
    <PageShell title="Updates" subtitle="Neuigkeiten & Devlogs von Softbrew Studio.">
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        <GlassCard accent="focuspilot" animated={false} className="p-0">
          <div className="p-5">
            <h2 className="text-lg font-semibold mb-2">FocusPilot</h2>
            <DevlogList items={fp} />
            <div className="mt-4">
              <Link
                href="/updates/focuspilot"
                className="inline-flex items-center gap-1 rounded-lg border border-white/70 px-3 py-2 text-white hover:bg-white/10 active:bg-white/15"
              >
                Alle Updates →
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
                href="/updates/shiftrix"
                className="inline-flex items-center gap-1 rounded-lg border border-white/70 px-3 py-2 text-white hover:bg-white/10 active:bg-white/15"
              >
                Alle Updates →
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
                href="/updates/linguai"
                className="inline-flex items-center gap-1 rounded-lg border border-white/70 px-3 py-2 text-white hover:bg-white/10 active:bg-white/15"
              >
                Alle Updates →
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}

