import PageShell from "@/components/PageShell";
import { Card } from "@/components/Card";

export default function LinguaiPage() {
  return (
    <PageShell title="LinguAI" subtitle="Sprachen lernen – KI-gestützt & effizient.">
      {/* Akzent-Section */}
      <section className="rounded-brand p-6 bg-product-linguai text-white">
        <h2 className="text-xl font-semibold mb-2">Lernen, das sich an dich anpasst</h2>
        <p className="opacity-90">
          Adaptive Übungen, echte Verständnistests, klare Fortschritte.
        </p>

        {/* Neutrale Cards innen */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Card className="bg-white text-softbrew-black">
            <Card.Header title="Adaptive Lessons" />
            <Card.Body>Level-Erkennung, gezielte Wiederholung, Tempo-Anpassung.</Card.Body>
          </Card>

          <Card className="bg-white text-softbrew-black">
            <Card.Header title="Aussprache & Dialoge" />
            <Card.Body>Echtzeit-Feedback, praxisnahe Szenarien.</Card.Body>
          </Card>

          <Card className="bg-white text-softbrew-black md:col-span-2">
            <Card.Header title="Vokabeln & Grammatik" />
            <Card.Body>Smartes Spaced-Repetition, Regel-Erklärung im Kontext.</Card.Body>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

