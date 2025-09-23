// src/app/updates/linguai/page.tsx
import PageShell from "@/components/PageShell";
import { Card } from "@/components/Card";
import DevlogList from "@/components/DevlogList";
import { supabaseServer } from "@/lib/supabaseServer";

type Row = {
  date: string;
  title: string;
  summary: string;
  tags: string[] | null;
};

export default async function Page() {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("devlogs")
    .select("date,title,summary,tags")
    .eq("project", "linguai")
    .order("date", { ascending: false });

  if (error) {
    return (
      <PageShell title="LinguAI – Updates" subtitle="Devlogs & Release Notes">
        <Card className="bg-white text-softbrew-black">
          <p className="text-sm">Fehler beim Laden der Devlogs: {error.message}</p>
        </Card>
      </PageShell>
    );
  }

  const items =
    (data as Row[] | null)?.map((r) => ({
      date: r.date,
      title: r.title,
      summary: r.summary,
      tags: r.tags ?? undefined,
    })) ?? [];

  return (
    <PageShell title="LinguAI – Updates" subtitle="Devlogs & Release Notes">
      <section className="rounded-brand p-6 bg-product-linguai text-white mb-6">
        <h2 className="text-xl font-semibold mb-2">Devlogs</h2>
        <p className="opacity-90">
          Alle Änderungen, Fixes und Notizen rund um LinguAI.
        </p>
      </section>

      <Card className="bg-white text-softbrew-black">
        <DevlogList items={items} />
      </Card>
    </PageShell>
  );
}

