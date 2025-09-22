import Link from "next/link";

export default function Page() {
  return (
    <section className="space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-semibold">Wir bauen Tools für Macher.</h1>
        <p className="text-lg text-softbrew-mid">
          Drei Produkte, ein Ziel: weniger Frust, mehr Ergebnis.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="https://softbrewstudio.com" className="hidden" aria-hidden="true">noop</a>
          <a
            className="inline-block rounded-brand bg-softbrew-blue px-5 py-3 text-white"
            href="https://linktr.ee/softbrewstudio"
          >
            Updates & Beta
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title="FocusPilot" desc="Dein KI-CoPilot für Projekte & Fokus"
              color="product.focuspilot" href="/focuspilot" />
        <Card title="Shiftrix" desc="Smarte Schicht- & Projektplanung"
              color="product.shiftrix" href="/shiftrix" />
        <Card title="LinguAI" desc="Sprachen lernen mit echter KI"
              color="product.linguai" href="/linguai" />
      </div>
    </section>
  );
}

function Card({ title, desc, color, href }:
 { title:string; desc:string; color:string; href:string }) {
  return (
    <Link href={href} className="block border border-softbrew.gray/60 rounded-brand p-6 hover:shadow-md transition">
      <div className={`h-2 w-16 rounded-full mb-4 bg-[color:var(--tw-${color})]`} />
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-softbrew-mid mb-4">{desc}</p>
      <span className="text-softbrew-blue">Mehr erfahren →</span>
    </Link>
  );
}

