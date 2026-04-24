"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

const features = [
  {
    icon: "🧠",
    title: "Project Memory",
    body: "FocusPilot knows what you built, why you built it, and what you decided along the way. No more digging through old chats, notes, or commit messages.",
  },
  {
    icon: "⚡",
    title: "Instant Re-entry",
    body: "Been away for a week? FocusPilot gives you a structured briefing the moment you return — current state, open decisions, safe next steps. Ready in seconds.",
  },
  {
    icon: "🔒",
    title: "Your Data, Your Rules",
    body: "Works locally or synced to the cloud. Multi-provider AI — OpenAI, Anthropic, or fully local. No vendor lock-in.",
  },
];

export default function FocusPilotPage() {
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
          FocusPilot remembers why you built it, what you decided, and where
          you left off —{" "}
          <span className="text-product-focuspilot">
            so you can get back to work in minutes, not hours.
          </span>
        </motion.h1>

        <motion.p
          className="text-lg text-white/70 leading-relaxed"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
        >
          Whether you&apos;re building software, electronics, or something entirely
          different — FocusPilot tracks your decisions, remembers your context,
          and gets you back up to speed instantly. For solo builders and small
          teams who can&apos;t afford to lose momentum.
        </motion.p>

        <motion.a
          href="/beta/focuspilot"
          className="inline-block rounded-brand bg-product-focuspilot px-7 py-3 font-medium text-white shadow hover:shadow-lg active:scale-[0.99] transition"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.16 }}
        >
          Join the Early Access →
        </motion.a>
      </div>

      {/* Feature blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {features.map(({ icon, title, body }, i) => (
          <GlassCard key={title} accent="focuspilot" animated delay={i * 0.06}>
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-white/70 leading-relaxed">{body}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
