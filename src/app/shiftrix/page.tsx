import PageShell from "@/components/PageShell";
import { Card } from "@/components/Card";

export default function ShiftrixPage() {
  return (
    <PageShell title="Shiftrix" subtitle="Planung & Organisation für Teams.">
      {/* Akzent-Section */}
      <section className="rounded-brand p-6 bg-product-shiftrix text-white">
        <h2 className="text-xl font-semibold mb-2">Baukasten für Schichten & Projekte</h2>
        <p className="opacity-90">
          Module flexibel aktivieren, Teams koordinieren, sauber abrechnen.
        </p>

        {/* Neutrale Cards innen */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Card className="bg-white text-softbrew-black">
            <Card.Header title="Schichtplanung" />
            <Card.Body>Drag & Drop, Abwesenheiten, Regeln.</Card.Body>
          </Card>

          <Card className="bg-white text-softbrew-black">
            <Card.Header title="Zeiterfassung" />
            <Card.Body>Check-ins, Exporte, Auswertung.</Card.Body>
          </Card>

          <Card className="bg-white text-softbrew-black md:col-span-2">
            <Card.Header title="Kommunikation & Doku" />
            <Card.Body>Chat, Aufgaben, Dateien – alles an einem Ort.</Card.Body>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

