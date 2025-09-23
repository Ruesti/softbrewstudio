// src/components/Card.tsx
import React from "react";
import clsx from "clsx";

type Variant = "neutral" | "focuspilot" | "shiftrix" | "linguai";

const accentBorder: Record<Variant, string> = {
  neutral: "border-softbrew.gray/60",
  focuspilot: "border-product-focuspilot",
  shiftrix: "border-product-shiftrix",
  linguai: "border-product-linguai",
};

export function Card({
  children,
  className = "",
  variant = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}) {
  return (
    <div className={clsx("rounded-brand border bg-white shadow-sm", accentBorder[variant], className)}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({
  title,
  subtitle,
  variant = "neutral",
}: {
  title: string;
  subtitle?: string;
  variant?: Variant;
}) {
  const bar =
    variant === "focuspilot"
      ? "bg-product-focuspilot"
      : variant === "shiftrix"
      ? "bg-product-shiftrix"
      : variant === "linguai"
      ? "bg-product-linguai"
      : "bg-softbrew-gray";

  return (
    <div className="rounded-t-brand overflow-hidden">
      <div className={clsx("h-1 w-full", bar)} />
      <div className="p-5">
        <h2 className="text-xl font-medium">{title}</h2>
        {subtitle && <p className="mt-1 text-softbrew-mid">{subtitle}</p>}
      </div>
    </div>
  );
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="px-5 pb-5">{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="px-5 pb-5 pt-3 border-t border-softbrew.gray/60">{children}</div>;
};

