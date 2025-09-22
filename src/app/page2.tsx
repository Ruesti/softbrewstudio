import Link from "next/link";

export default function Page() {
  return (
    <section className="mx-auto max-w-6xl space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-semibold">Wir bauen Tools für Macher.</h1>
        <p className="text-lg text-white/70">
          Drei Produkte, ein Ziel: weniger Frust, mehr Ergebnis.
        </p>
        <a
          className="inline-block rounded-brand bg-softbrew-blue px-5 py-3 text-white font-medium shadow hover:shadow-md active:scale-[0.99] transition"
          href="https://linktr.ee/softbrewstudio"
        >
          Updates & Beta
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card
          title="FocusPilot"
          desc="Dein KI-CoPilot für Projekte & Fokus"
          color="#7C3AED"
          href="/focuspilot"
        />
        <Card
          title="Shiftrix"
          desc="Smarte Schicht- & Projektplanung"
          color="#F97316"
          href="/shiftrix"
        />
        <Card
          title="LinguAI"
          desc="Sprachen lernen mit echter KI"
          color="#10B981"
          href="/linguai"
        />
      </div>
    </section>
  );
}

function Card({
  title, desc, color, href,
}: { title: string; desc: string; color: string; href: string }) {
  return (
    <Link
      href={href}
      className="group block rounded-brand border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/20 transition shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
    >
      <div className="mb-4 h-1.5 w-16 rounded-full" style={{ backgroundColor: color }} />
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-white/70 mb-4">{desc}</p>
      <span className="text-softbrew-blue">Mehr erfahren →</span>
    </Link>
  );
}

