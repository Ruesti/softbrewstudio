import PageShell from "@/components/PageShell";
import { Card } from "@/components/Card";

export default function FocusPilotPage() {
  return (
    <PageShell title="FocusPilot" subtitle="Produktivität für kreative Köpfe.">
      {/* Akzent-Section */}
      <section className="rounded-brand p-6 bg-product-focuspilot text-white">
        <h2 className="text-xl font-semibold mb-2">Dein smarter Co-Pilot</h2>
        <p className="opacity-90">
          Fokus halten, Projekte strukturieren, Fortschritt sichtbar machen.
        </p>

        {/* Neutrale Cards innen */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Card className="bg-white text-softbrew-black">
            <Card.Header title="Projekte & Aufgaben" />
            <Card.Body>Boards, Prioritäten, Deadlines, Zuständigkeiten.</Card.Body>
          </Card>

          <Card className="bg-white text-softbrew-black">
            <Card.Header title="KI-Coach" />
            <Card.Body>Kontext-Tipps, Wiedereinstiegs-Hinweise, sanfte Nudges.</Card.Body>
          </Card>

          <Card className="bg-white text-softbrew-black md:col-span-2">
            <Card.Header title="Sync & Cloud" />
            <Card.Body>Supabase, Multi-Device, sichere Speicherung.</Card.Body>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

