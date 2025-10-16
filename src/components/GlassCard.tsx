"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { PropsWithChildren } from "react";

type Accent = "focuspilot" | "shiftrix" | "linguai" | "neutral";
type BlurMode = "none" | "hover" | "always";

const accentMap: Record<Accent, string> = {
  focuspilot: "from-product-focuspilot/40 to-product-focuspilot/10",
  shiftrix:   "from-product-shiftrix/40 to-product-shiftrix/10",
  linguai:    "from-product-linguai/40 to-product-linguai/10",
  neutral:    "from-white/20 to-white/5",
};

type GlassProps = PropsWithChildren<{
  href?: string;
  accent?: Accent;
  className?: string;
  minH?: string;
  animated?: boolean;
  blur?: BlurMode;        // "none" | "hover" | "always"
  speed?: number;         // Einflug-Dauer
  hoverSpeed?: number;    // Hover-Lift-Dauer
}>;

function GlassCard({
  href,
  accent = "neutral",
  className = "",
  minH = "min-h-[200px] md:min-h-[230px]",
  animated = true,
  blur = "hover",
  speed = 0.22,
  hoverSpeed = 0.10,
  children,
}: GlassProps) {
  const Root: any = href ? Link : "div";
  const gradient = accentMap[accent];

  const rootBase = clsx(
    "group relative isolate block h-full rounded-brand overflow-hidden",
    // Ring + Shadow: gezielt animieren (KEIN transform!)
    "ring-1 ring-white/20 hover:ring-white/30 transition-colors duration-200",
    "shadow transition-[box-shadow] duration-200",
    // wichtig für flinken Hover-Lift:
    "transform-gpu will-change-transform",
    className
  );

  // Blur-Layer – nie Filter toggeln; nur opacity
  const BlurLayer =
    blur === "none" ? null :
    blur === "always" ? (
      <div className="absolute inset-0 pointer-events-none z-0 backdrop-blur-md" />
    ) : (
      <div className="absolute inset-0 pointer-events-none z-0 backdrop-blur-md opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
    );

  const content = (
    <>
      {BlurLayer}
      {/* Tint (Helligkeit) */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-white/5 transition-colors duration-150 group-hover:bg-white/10" />
      {/* Akzent-Film */}
      <div className={`absolute inset-0 pointer-events-none z-0 bg-gradient-to-br ${gradient} opacity-30 transition-opacity duration-150 group-hover:opacity-55`} />
      {/* Inhalt */}
      <div className={`relative z-10 p-6 md:p-8 w-full flex flex-col ${minH}`}>{children}</div>
    </>
  );

  if (!animated) {
    return href ? (
      <Root href={href} className={rootBase}>{content}</Root>
    ) : (
      <div className={rootBase}>{content}</div>
    );
  }

  // Motion-Varianten – getrennte Transitions für Einflug vs. Hover-Lift
  const MotionLink = motion(Link);
  if (href) {
    return (
      <MotionLink
        href={href}
        className={rootBase}
        initial={{ y: 18, opacity: 0, scale: 0.985 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: speed, ease: "easeOut" }}
        whileHover={{
          y: -6,
          scale: 1.01,
          transition: { duration: hoverSpeed, ease: "easeOut" }, // sofort & flott
        }}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.div
      className={rootBase}
      initial={{ y: 18, opacity: 0, scale: 0.985 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: speed, ease: "easeOut" }}
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: { duration: hoverSpeed, ease: "easeOut" },
      }}
    >
      {content}
    </motion.div>
  );
}

export default GlassCard;
export { GlassCard };
