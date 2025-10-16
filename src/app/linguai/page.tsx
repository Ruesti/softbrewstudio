// RICHTIG
import GlassCard from "@/components/GlassCard";

export default function LinguAIPage() {
  return (
    <section className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-semibold">LinguAI</h1>
      <p className="text-white/80 max-w-2xl">
        Echte Lernkurven statt Gamification – adaptiv und ruhig.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <GlassCard accent="linguai" animated={false}>
          <h3 className="text-xl font-semibold">Kernidee</h3>
          <p className="text-white/75 mt-2">Personalisierte Drills, sinnvolle Wiederholungen, klare Ziele.</p>
        </GlassCard>
        <GlassCard accent="linguai" animated={false}>
          <h3 className="text-xl font-semibold">Roadmap</h3>
          <p className="text-white/75 mt-2">Decks, Audio, Live-Coach, Export nach Anki.</p>
        </GlassCard>
      </div>
    </section>
  );
}

