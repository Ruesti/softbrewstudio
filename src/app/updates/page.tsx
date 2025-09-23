// src/app/updates/page.tsx
import PageShell from "@/components/PageShell";
import DevlogList from "@/components/DevlogList";
import { supabaseServer } from "@/lib/supabaseServer";

async function fetchTop(project: "focuspilot"|"shiftrix"|"linguai", n=3) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("devlogs")
    .select("date,title,summary,tags,links")
    .eq("project", project)
    .order("date", { ascending: false })
    .limit(n);
  if (error) throw error;
  return data ?? [];
}

export default async function UpdatesPage() {
  const [fp, sx, la] = await Promise.all([
    fetchTop("focuspilot", 3),
    fetchTop("shiftrix", 3),
    fetchTop("linguai", 3),
  ]);

  return (
    <PageShell title="Updates" subtitle="Neuigkeiten & Devlogs von Softbrew Studio.">
      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-brand p-5 bg-product-focuspilot text-white">
          <h2 className="text-lg font-semibold mb-2">FocusPilot</h2>
          <DevlogList items={fp as any} />
          <div className="mt-4">
            <a className="inline-flex items-center gap-1 rounded-lg border border-white/70 px-3 py-2 text-white visited:text-white hover:bg-white/10 active:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60" href="/updates/focuspilot">Alle Updates →</a>
          </div>
        </section>

        <section className="rounded-brand p-5 bg-product-shiftrix text-white">
          <h2 className="text-lg font-semibold mb-2">Shiftrix</h2>
          <DevlogList items={sx as any} />
          <div className="mt-4">
            <a className="inline-flex items-center gap-1 rounded-lg border border-white/70 px-3 py-2 text-white visited:text-white hover:bg-white/10 active:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60" href="/updates/shiftrix">Alle Updates →</a>
          </div>
        </section>

        <section className="rounded-brand p-5 bg-product-linguai text-white">
          <h2 className="text-lg font-semibold mb-2">LinguAI</h2>
          <DevlogList items={la as any} />
          <div className="mt-4">
            <a className="inline-flex items-center gap-1 rounded-lg border border-white/70 px-3 py-2 text-white visited:text-white hover:bg-white/10 active:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60" href="/updates/linguai">Alle Updates →</a>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

