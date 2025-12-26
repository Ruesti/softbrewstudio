// src/app/updates/softbrew/page.tsx
import PageShell from "@/components/PageShell";
import Link from "next/link";

export default function SoftbrewUpdatesPage() {
  return (
    <PageShell title="Softbrew Devlog" subtitle="Notes from the studio.">
      <div className="space-y-6 max-w-3xl">
        <p className="text-white/80 leading-relaxed">
          This is the studio devlog — decisions, experiments, and progress across projects.
        </p>

        <div className="flex gap-4">
          <Link
            href="/updates"
            className="text-sm text-white/70 underline underline-offset-4 hover:text-white transition"
          >
            All updates →
          </Link>
          <Link
            href="/softbrew"
            className="text-sm text-white/70 underline underline-offset-4 hover:text-white transition"
          >
            Back to Studio →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
