import Link from "next/link";

export default function SoftbrewPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Softbrew Studio
      </h1>

      <p className="mt-6 text-white/80 leading-relaxed">
        Softbrew Studio is my independent workspace for building software that
        I actually want to exist.
      </p>

      <p className="mt-4 text-white/80 leading-relaxed">
        I care deeply about tools that respect the people using them. Lately,
        it feels like many products are optimized primarily for extraction:
        attention, data, money — often at the cost of quality, clarity, or
        honesty.
      </p>

      <p className="mt-4 text-white/80 leading-relaxed">
        I&apos;m not immune to that world. I also want to earn money with my
        work. But I don&apos;t want to build software that depends on pressure,
        manipulation, or artificial urgency.
      </p>

      <p className="mt-4 text-white/80 leading-relaxed">
        Softbrew Studio exists to explore a different pace: thoughtful,
        transparent, and built in public — without pretending to have all the
        answers.
      </p>

      <h2 className="mt-10 text-xl font-semibold">
        Built in public
      </h2>

      <p className="mt-4 text-white/80 leading-relaxed">
        I write devlogs to document decisions, doubts, experiments, and
        progress. Not as polished announcements, but as working notes that
        others are welcome to read.
      </p>

      <p className="mt-4 text-white/80 leading-relaxed">
        If something is unfinished, unclear, or changes direction — that&apos;s
        part of the process.
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/updates/softbrew"
          className="underline underline-offset-4 hover:text-white transition"
        >
          Read the Softbrew devlog →
        </Link>

        <Link
          href="/"
          className="underline underline-offset-4 hover:text-white transition"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
