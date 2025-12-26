// src/app/page.tsx
import Link from "next/link";

type Product = {
  key: string;
  name: string;
  tagline: string;
  href: string;
  devlogHref: string;
  bgClass: string;

  // Accent polish (uses your Tailwind tokens)
  accentRing: string;
  accentDot: string;
  accentBtn: string;
  accentGlow: string; // subtle colored glow overlay
};

const products: Product[] = [
  {
    key: "focuspilot",
    name: "FocusPilot",
    tagline: "A calm co-pilot for focus & projects.",
    href: "/focuspilot",
    devlogHref: "/updates/focuspilot",
    bgClass: "bg-[url('/images/focuspilot-bg.jpg')]",
    accentRing: "ring-1 ring-product-focuspilot/35 group-hover:ring-product-focuspilot/55",
    accentDot: "bg-product-focuspilot",
    accentBtn: "bg-product-focuspilot/25 hover:bg-product-focuspilot/35",
    accentGlow:
      "from-product-focuspilot/25 via-product-focuspilot/0 to-transparent",
  },
  {
    key: "shiftrix",
    name: "Shiftrix",
    tagline: "Flexible workforce & project planning.",
    href: "/shiftrix",
    devlogHref: "/updates/shiftrix",
    bgClass: "bg-[url('/images/shiftrix-bg.jpg')]",
    accentRing: "ring-1 ring-product-shiftrix/35 group-hover:ring-product-shiftrix/55",
    accentDot: "bg-product-shiftrix",
    accentBtn: "bg-product-shiftrix/25 hover:bg-product-shiftrix/35",
    accentGlow: "from-product-shiftrix/25 via-product-shiftrix/0 to-transparent",
  },
  {
    key: "linguai",
    name: "LinguAI",
    tagline: "Language learning that aims for real progress.",
    href: "/linguai",
    devlogHref: "/updates/linguai",
    bgClass: "bg-[url('/images/linguai-bg.jpg')]",
    accentRing: "ring-1 ring-product-linguai/35 group-hover:ring-product-linguai/55",
    accentDot: "bg-product-linguai",
    accentBtn: "bg-product-linguai/25 hover:bg-product-linguai/35",
    accentGlow: "from-product-linguai/25 via-product-linguai/0 to-transparent",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Tools for makers. Built in public.
        </h1>
        <p className="mt-3 text-base sm:text-lg text-white/70 max-w-2xl">
          Three projects, one goal: less friction, more real progress.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/updates"
            className="rounded-brand bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
          >
            Devlog
          </Link>
          <Link
            href="/alpha"
            className="rounded-brand bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
          >
            Alpha
          </Link>
          <Link
            href="/softbrew"
            className="rounded-brand bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
          >
            Studio
          </Link>
        </div>
      </section>

      {/* PRODUCT TILES */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.key}
              className={[
                "group relative overflow-hidden rounded-2xl border border-white/10",
                "bg-cover bg-center",
                "min-h-[320px] sm:min-h-[360px] flex flex-col justify-end",
                "cursor-pointer select-none",
                "transition-all duration-300 hover:-translate-y-0.5 hover:brightness-[1.03] hover:shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)]",
                p.bgClass,
                p.accentRing,
              ].join(" ")}
            >
              {/* Decorative overlays MUST be below the clickable overlay-link */}
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

              <div
                className={[
                  "absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  "bg-gradient-to-t",
                  p.accentGlow,
                ].join(" ")}
              />

              {/* Whole card clickable (product) */}
              <Link
                href={p.href}
                aria-label={`Open ${p.name}`}
                className="absolute inset-0 z-10"
              />

              {/* content above overlay-link */}
              <div className="relative z-20 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold leading-tight flex items-center gap-2">
                    <span
                      className={[
                        "h-2 w-2 rounded-full",
                        p.accentDot,
                        "shadow-[0_0_0_4px_rgba(255,255,255,0.06)]",
                      ].join(" ")}
                      aria-hidden
                    />
                    {p.name}
                  </h2>

                  <Link
                    href={p.devlogHref}
                    className="relative z-20 text-xs text-white/70 hover:text-white underline underline-offset-4 transition"
                  >
                    Devlog →
                  </Link>
                </div>

                <p className="mt-2 text-sm text-white/80">{p.tagline}</p>

                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={p.href}
                    className={[
                      "relative z-20 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition",
                      "text-white bg-white/15 hover:bg-white/20",
                      p.accentBtn,
                    ].join(" ")}
                  >
                    Learn more <span aria-hidden>→</span>
                  </Link>

                  <Link
                    href={p.devlogHref}
                    className="relative z-20 text-sm text-white/70 hover:text-white transition"
                  >
                    Read notes
                  </Link>
                </div>
              </div>

              {/* subtle bottom shine */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Small footer hint */}
        <div className="mt-10 text-sm text-white/65">
          Softbrew Studio is the independent workspace behind these projects.{" "}
          <Link
            href="/softbrew"
            className="underline underline-offset-4 hover:text-white transition"
          >
            Read the story
          </Link>
          .
        </div>
      </section>
    </main>
  );
}
