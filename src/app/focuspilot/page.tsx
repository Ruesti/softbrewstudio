// src/app/focuspilot/page.tsx
import Link from "next/link";
import GlassCard from "@/components/GlassCard";

export default function FocusPilotPage() {
  return (
    <section className="space-y-10 max-w-3xl">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold">FocusPilot</h1>

      <p className="text-white/80 max-w-2xl">
        A calm co-pilot for focus, projects, and day structure.
      </p>

      {/* Core narrative (quiet, non-marketing) */}
      <div className="space-y-4 text-white/80 leading-relaxed max-w-2xl">
        <p>
          FocusPilot started from a very personal problem: too many ideas, too
          many ongoing projects, and a constant feeling of being behind — even
          while actively building things.
        </p>

        <p>
          Many productivity tools assume a clean starting point: clear goals,
          stable routines, a calm mind. That wasn&apos;t my reality most of the
          time.
        </p>

        <p>
          FocusPilot is an attempt to build something quieter. No pressure, no
          gamification, no constant nudging — just support that helps you regain
          orientation without judgement.
        </p>
      </div>

      {/* Cards (keep your existing UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <GlassCard accent="focuspilot" animated={false}>
          <h3 className="text-xl font-semibold">Why FocusPilot?</h3>
          <p className="text-white/75 mt-2">
            Gentle structure instead of pressure. Support that doesn&apos;t
            distract or guilt-trip you.
          </p>
        </GlassCard>

        <GlassCard accent="focuspilot" animated={false}>
          <h3 className="text-xl font-semibold">Current building blocks</h3>
          <p className="text-white/75 mt-2">
            Day planning, project overview, a real GPT chat, Supabase sync.
          </p>
        </GlassCard>
      </div>

      {/* Devlog link */}
      <div className="pt-4">
        <Link
          href="/updates/focuspilot"
          className="text-sm text-white/70 underline underline-offset-4 hover:text-white transition"
        >
          Read the FocusPilot devlog →
        </Link>
      </div>
    </section>
  );
}
