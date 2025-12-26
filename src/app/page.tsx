import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b0f17] text-white">
      <div className="mx-auto max-w-4xl px-5 py-16">
        <header className="flex items-center justify-between gap-4">
          <Link href="https://softbrewstudio.com" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 ring-1 ring-white/15 grid place-items-center">
              <span className="text-xl">🍺</span>
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">Softbrew Studio</div>
              <div className="text-xs text-white/60">FocusPilot Alpha</div>
            </div>
          </Link>

          <a
            href="https://softbrewstudio.com/updates/focuspilot"
            className="text-sm text-white/70 hover:text-white transition underline underline-offset-4"
          >
            Read Devlog →
          </a>
        </header>

        <section className="mt-14 rounded-3xl bg-white/5 ring-1 ring-white/10 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            FocusPilot Alpha Portal
          </h1>

          <p className="mt-4 text-white/75 max-w-2xl leading-relaxed">
            FocusPilot is primarily a desktop app (and later Android/iOS).
            This page is the public entry point for early access, notes, and downloads.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#downloads"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-black px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Downloads <span aria-hidden>→</span>
            </a>

            <a
              href="https://softbrewstudio.com/focuspilot"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 ring-1 ring-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/15 transition"
            >
              Product page <span aria-hidden>→</span>
            </a>

            <a
              href="https://softbrewstudio.com/updates/focuspilot"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 ring-1 ring-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/15 transition"
            >
              Devlog <span aria-hidden>→</span>
            </a>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <div className="text-sm text-white/60">Status</div>
              <div className="mt-1 font-semibold">Active development</div>
              <div className="mt-2 text-sm text-white/70">
                UI is evolving fast. Expect changes.
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <div className="text-sm text-white/60">Principle</div>
              <div className="mt-1 font-semibold">Calm, not pushy</div>
              <div className="mt-2 text-sm text-white/70">
                No pressure loops. No guilt UI. Just support.
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <div className="text-sm text-white/60">Entry</div>
              <div className="mt-1 font-semibold">Early access</div>
              <div className="mt-2 text-sm text-white/70">
                Start here for builds and release notes.
              </div>
            </div>
          </div>
        </section>

        <section id="downloads" className="mt-10 space-y-4 max-w-3xl">
          <h2 className="text-xl font-semibold">Downloads</h2>
          <p className="text-white/75 leading-relaxed">
            Coming soon. This section will host signed builds for desktop and links to mobile test tracks.
          </p>

          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 text-sm text-white/70">
            Placeholder:
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Windows (signed) – TBD</li>
              <li>macOS – TBD</li>
              <li>Linux – TBD</li>
              <li>Android (internal testing) – TBD</li>
              <li>iOS (TestFlight) – TBD</li>
            </ul>
          </div>
        </section>

        <footer className="mt-14 text-sm text-white/55">
          © {new Date().getFullYear()} Softbrew Studio
        </footer>
      </div>
    </main>
  );
}
