// RICHTIG
import GlassCard from "@/components/GlassCard";


export default function FocusPilotPage() {
  return (
    <section className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-semibold">FocusPilot</h1>
      <p className="text-white/80 max-w-2xl">
        Dein ruhiger Co-Pilot für Fokus, Projekte und Tagesstruktur.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <GlassCard accent="focuspilot" animated={false}>
          <h3 className="text-xl font-semibold">Warum FocusPilot?</h3>
          <p className="text-white/75 mt-2">Sanfte Struktur statt Druck. KI-Assists, die nicht nerven.</p>
        </GlassCard>
        <GlassCard accent="focuspilot" animated={false}>
          <h3 className="text-xl font-semibold">Features</h3>
          <p className="text-white/75 mt-2">Tagescoach, Projektboards, GPT-Coach, Supabase Sync.</p>
        </GlassCard>
      </div>
    </section>
  );
}

