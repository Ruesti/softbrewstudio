// RICHTIG
import GlassCard from "@/components/GlassCard";


export default function ShiftrixPage() {
  return (
    <section className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-semibold">Shiftrix</h1>
      <p className="text-white/80 max-w-2xl">
        Workforce- & Projektplanung flexibel, nachvollziehbar, skalierbar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <GlassCard accent="shiftrix" animated={false}>
          <h3 className="text-xl font-semibold">Scheduler</h3>
          <p className="text-white/75 mt-2">Schichten, Projekte, Auslastung – klar visualisiert.</p>
        </GlassCard>
        <GlassCard accent="shiftrix" animated={false}>
          <h3 className="text-xl font-semibold">Integrationen</h3>
          <p className="text-white/75 mt-2">Stripe, Supabase, später Exporte.</p>
        </GlassCard>
      </div>
    </section>
  );
}

