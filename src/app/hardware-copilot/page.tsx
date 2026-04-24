"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

const features = [
  {
    icon: "🔌",
    title: "Reference Circuits",
    body: "Describe what you want to build — Hardware Copilot suggests proven reference circuits as a starting point. No blank canvas, no guesswork.",
  },
  {
    icon: "🔍",
    title: "Component Finder",
    body: "Finds the right voltage regulators, decoupling caps, and supporting parts for your design — with context-aware recommendations, not generic lists.",
  },
  {
    icon: "📄",
    title: "Datasheet Decoder",
    body: "Paste in a datasheet section and get a plain-language explanation. Register maps, timing diagrams, application circuits — decoded on demand.",
  },
  {
    icon: "⚠️",
    title: "Pitfall Guard",
    body: "Hardware Copilot flags common mistakes before you spin your board — missing decoupling caps, wrong footprints, overlooked voltage ratings.",
  },
];

const trust = [
  { label: "One-time purchase", detail: "Pay once, own it forever. No recurring fees." },
  { label: "Bring your API key", detail: "Your own Anthropic key. You stay in control." },
  { label: "No cloud, no server", detail: "Runs fully local. No hidden costs, no tracking." },
];

export default function HardwareCopilotPage() {
  return (
    <section className="space-y-16">

      {/* Hero */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          You have an idea for a circuit —{" "}
          <span className="text-product-hardware-copilot">
            but then the real work begins.
          </span>
        </motion.h1>

        <motion.p
          className="text-lg text-white/70 leading-relaxed"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
        >
          Which voltage regulator? Which decoupling capacitors? What does that
          datasheet actually mean? Where are the pitfalls? Hardware Copilot is
          an AI-powered desktop assistant that guides you from your first rough
          concept to a complete component list.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.16 }}
        >
          <a
            href="/beta/hardware-copilot"
            className="inline-block rounded-brand bg-product-hardware-copilot px-7 py-3 font-medium text-white shadow hover:shadow-lg active:scale-[0.99] transition"
          >
            Join the Waitlist →
          </a>
          <span className="text-sm text-white/40">
            Built by a hobbyist, for hobbyists.
          </span>
        </motion.div>
      </div>

      {/* Feature blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map(({ icon, title, body }, i) => (
          <GlassCard key={title} accent="hardware-copilot" delay={i * 0.06}>
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-white/70 leading-relaxed">{body}</p>
          </GlassCard>
        ))}
      </div>

      {/* Trust / Pricing */}
      <motion.div
        className="relative overflow-hidden rounded-brand ring-1 ring-white/15"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-product-hardware-copilot/15 to-transparent" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
        <div className="relative z-10 p-8 md:p-10">
          <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-6">
            Pricing &amp; Model
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {trust.map(({ label, detail }) => (
              <div key={label}>
                <div className="text-lg font-semibold text-product-hardware-copilot">{label}</div>
                <div className="text-white/60 text-sm mt-1 leading-relaxed">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

    </section>
  );
}
