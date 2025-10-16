// RICHTIG
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";


export default function Page() {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-5">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Wir bauen Tools für Macher.
        </h1>
        <p className="text-lg text-white/70">
          Drei Produkte, ein Ziel: weniger Frust, mehr Ergebnis.
        </p>
        <a
          className="inline-block rounded-brand bg-softbrew-blue px-6 py-3 text-white font-medium shadow hover:shadow-lg active:scale-[0.99] transition"
          href="/updates"
        >
          Beta & News
        </a>
      </div>

      <div id="produkte" className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <GlassCard href="/focuspilot" accent="focuspilot" >
          <h3 className="text-xl font-semibold">FocusPilot</h3>
          <p className="text-white/75 mt-2">Dein ruhiger Co-Pilot für Fokus & Projekte.</p>
        </GlassCard>

        <GlassCard href="/shiftrix" accent="shiftrix" delay={0.05}>
          <h3 className="text-xl font-semibold">Shiftrix</h3>
          <p className="text-white/75 mt-2">Flexible Workforce & Projekte im Griff.</p>
        </GlassCard>

        <GlassCard href="/linguai" accent="linguai" delay={0.1}>
          <h3 className="text-xl font-semibold">LinguAI</h3>
          <p className="text-white/75 mt-2">Sprachen lernen, das wirklich wirkt.</p>
        </GlassCard>
      </div>
    </section>
  );
}

