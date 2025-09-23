// src/components/PageShell.tsx
import React from "react";

export default function PageShell({
  title,
  subtitle,
  children,
  aside,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-softbrew-mid">{subtitle}</p>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <main className="space-y-6">{children}</main>
        {aside && <aside className="space-y-4">{aside}</aside>}
      </div>
    </div>
  );
}
