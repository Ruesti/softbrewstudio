import Link from "next/link";

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/20 border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 grid place-items-center transition group-hover:scale-[1.03]">
            <span className="text-xl">🍺</span>
          </div>
          <div>
            <div className="font-semibold tracking-tight">Softbrew Studio</div>
            <div className="text-xs text-white/60 -mt-0.5">Tools für Macher</div>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-5 text-sm text-white/85">
          <Link href="/focuspilot" className="hover:text-white transition">
            FocusPilot
          </Link>
          <Link href="/shiftrix" className="hover:text-white transition">
            Shiftrix
          </Link>
          <Link href="/linguai" className="hover:text-white transition">
            LinguAI
          </Link>

          {/* Entfernt: separater Updates-Link */}

          <Link
            href="/updates"
            className="rounded-brand bg-softbrew-blue/90 px-4 py-2 font-medium text-white shadow hover:shadow-lg active:scale-[0.99] transition"
          >
            Beta & News
          </Link>
        </nav>
      </div>
    </header>
  );
}
