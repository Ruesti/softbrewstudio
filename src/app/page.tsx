"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

export default function Page() {
  return (
    <section className="space-y-20">

      {/* Studio intro */}
      <div className="text-center space-y-4 pt-4">
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/60"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-softbrew-blue inline-block" />
          Softbrew Studio
        </motion.div>
        <motion.p
          className="text-white/50 text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          Focused tools for makers and independent builders.
        </motion.p>
      </div>

      {/* FocusPilot — Featured */}
      <motion.div
        className="relative overflow-hidden rounded-brand ring-1 ring-white/20 shadow-2xl"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-product-focuspilot/30 via-product-focuspilot/10 to-transparent" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

        <div className="relative z-10 p-8 md:p-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-product-focuspilot/40 bg-product-focuspilot/15 px-3 py-1 text-xs font-medium text-product-focuspilot mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-product-focuspilot inline-block animate-pulse" />
            Flagship Product
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-10">
            <div className="flex-1 space-y-5">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                FocusPilot
              </h2>
              <p className="text-white/65 text-lg leading-relaxed max-w-xl">
                Remembers why you built it, what you decided, and where you left off —
                so you can get back to work in minutes, not hours.
              </p>
            </div>
            <div className="flex flex-row md:flex-col gap-3 shrink-0">
              <a
                href="/focuspilot"
                className="inline-flex items-center justify-center rounded-brand border border-white/25 px-5 py-2.5 text-sm font-medium text-white hover:border-white/50 transition"
              >
                Learn More →
              </a>
              <a
                href="/beta/focuspilot"
                className="inline-flex items-center justify-center rounded-brand bg-product-focuspilot px-5 py-2.5 text-sm font-medium text-white shadow hover:shadow-lg active:scale-[0.99] transition"
              >
                Early Access →
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Also building */}
      <div className="space-y-5">
        <p className="text-xs text-white/35 uppercase tracking-widest font-medium">
          Also building
        </p>
        <div className="max-w-lg">
          <GlassCard href="/hardware-copilot" accent="hardware-copilot">
            <h3 className="text-xl font-semibold">Hardware Copilot</h3>
            <p className="text-white/65 mt-2 leading-relaxed">
              AI desktop assistant that guides you from rough concept to complete
              component list. Built by a hobbyist, for hobbyists.
            </p>
          </GlassCard>
        </div>
      </div>

    </section>
  );
}
