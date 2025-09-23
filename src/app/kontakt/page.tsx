// src/app/kontakt/page.tsx
"use client";
import React, { useState } from "react";
import PageShell from "@/components/PageShell";
import { Card } from "@/components/Card";

const EMAIL = "support@softbrewstudio.com";

export default function KontaktPage() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <PageShell title="Kontakt" subtitle="Sag Hallo – wir freuen uns über deine Nachricht.">
      <Card>
        <h2 className="text-xl font-medium mb-4">Direkt per E-Mail</h2>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center rounded-lg border border-softbrew.gray/60 px-3 py-2 hover:bg-softbrew.gray transition"
          >
            {EMAIL}
          </a>
          <button
            onClick={copy}
            className="inline-flex items-center rounded-lg border border-softbrew.gray/60 px-3 py-2 hover:bg-softbrew.gray transition"
          >
            {copied ? "Kopiert ✓" : "Kopieren"}
          </button>
        </div>
      </Card>
    </PageShell>
  );
}

