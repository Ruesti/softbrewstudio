"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Always Knows Where You Are",
    body: "FocusPilot runs silently in the background — capturing context, tracking decisions, and understanding your project state. No forms. No manual updates. No lists to maintain.",
  },
  {
    title: "Back Up to Speed in Minutes",
    body: "Been away for a week? FocusPilot briefs you instantly. Current state, what changed, what was decided, what comes next. Works for software, electronics, CAD, and anything in between.",
  },
  {
    title: "Synced With Reality",
    body: "FocusPilot knows your calendar. It reconciles what you planned with where your project actually is — and tells you only when it matters.",
  },
  {
    title: "Your Data, Your Rules",
    body: "Works locally or synced to the cloud. Multi-provider AI — OpenAI, Anthropic, or fully local. No vendor lock-in. You own everything.",
  },
];

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, project_type: projectType }),
      });
      const data = await res.json();
      if (data.ok) {
        setState("success");
      } else {
        setErrorMsg(data.error === "invalid_email" ? "Please enter a valid email address." : "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-6 space-y-2">
        <div className="text-2xl">✓</div>
        <p className="text-white font-medium">You&apos;re on the list.</p>
        <p className="text-white/50 text-sm">We&apos;ll reach out when your spot is ready.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm text-white/70" htmlFor="email">
          Email address <span className="text-white/40">(required)</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-brand bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-product-focuspilot/60 focus:bg-white/8 transition"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm text-white/70" htmlFor="project-type">
          What kind of projects do you work on? <span className="text-white/40">(optional)</span>
        </label>
        <input
          id="project-type"
          type="text"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          placeholder="e.g. embedded systems, web apps, electronics…"
          className="w-full rounded-brand bg-white/5 border border-white/15 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-product-focuspilot/60 focus:bg-white/8 transition"
        />
      </div>
      {state === "error" && (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full sm:w-auto rounded-brand bg-product-focuspilot px-8 py-3 font-medium text-white shadow hover:shadow-lg disabled:opacity-60 active:scale-[0.99] transition"
      >
        {state === "loading" ? "Joining…" : "Join the Waitlist →"}
      </button>
    </form>
  );
}

export default function Page() {
  return (
    <div className="space-y-32">

      {/* ── Section 1: Hero ── */}
      <section className="pt-6 space-y-8 max-w-3xl">
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-product-focuspilot/40 bg-product-focuspilot/10 px-3 py-1 text-xs font-medium text-product-focuspilot"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-product-focuspilot inline-block animate-pulse" />
          FocusPilot
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Remembers why you built it,
          what you decided, and where
          you left off —{" "}
          <span className="text-white/50">
            so you can get back to work in minutes, not hours.
          </span>
        </motion.h1>

        <motion.p
          className="text-white/60 text-lg leading-relaxed max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          Whether you&apos;re building software, electronics, or something entirely
          different — FocusPilot tracks your decisions, remembers your context,
          and gets you back up to speed instantly. For solo builders and small
          teams who can&apos;t afford to lose momentum.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <a
            href="#early-access"
            className="inline-flex items-center justify-center rounded-brand bg-product-focuspilot px-7 py-3.5 text-base font-medium text-white shadow-lg hover:shadow-xl hover:bg-product-focuspilot/90 active:scale-[0.99] transition"
          >
            Join the Early Access →
          </a>
        </motion.div>
      </section>

      {/* ── Section 2: Feature blocks ── */}
      <section className="space-y-6">
        <p className="text-xs text-white/35 uppercase tracking-widest font-medium">
          What it does
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="rounded-brand border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-3 hover:border-product-focuspilot/30 hover:bg-white/8 transition-colors duration-200"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
            >
              <div className="h-1 w-8 rounded-full bg-product-focuspilot/60" />
              <h3 className="font-semibold text-base leading-snug">{f.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Early Access / Waitlist ── */}
      <section id="early-access" className="scroll-mt-24">
        <motion.div
          className="rounded-brand border border-white/15 bg-white/5 backdrop-blur-sm p-8 md:p-12 max-w-2xl space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight">
              Be the first to try FocusPilot.
            </h2>
            <p className="text-white/55 leading-relaxed">
              We&apos;re opening early access to a small group of builders in Summer
              2026. No spam — just one email when your spot is ready.
            </p>
          </div>

          <WaitlistForm />

          <p className="text-white/35 text-sm border-t border-white/10 pt-6">
            Early access includes direct feedback access to the founder.
            Your input shapes the product.
          </p>
        </motion.div>
      </section>

      {/* ── Section 4: Hardware Copilot teaser ── */}
      <section>
        <motion.div
          className="rounded-brand border border-product-hardware-copilot/20 bg-product-hardware-copilot/5 backdrop-blur-sm p-8 max-w-xl space-y-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Hardware Copilot</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-product-hardware-copilot/40 bg-product-hardware-copilot/15 px-2.5 py-0.5 text-xs font-medium text-product-hardware-copilot">
              In Development
            </span>
          </div>
          <p className="text-white/55 text-sm leading-relaxed">
            AI-assisted electronics platform for embedded systems and PCB design.
            Built for makers who work at the intersection of software and hardware.
          </p>
        </motion.div>
      </section>

    </div>
  );
}
