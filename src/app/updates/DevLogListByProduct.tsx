"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = "focuspilot" | "shiftrix" | "linguai";
type DevLog = {
  id: string;
  created_at: string;
  project: Product;
  title: string;
  body: string;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    year: "numeric", month: "short", day: "2-digit",
  });
}
function excerpt(md: string, len = 100) {
  const plain = md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > len ? plain.slice(0, len - 1) + "…" : plain;
}

export default function DevLogListByProduct({
  project,
  limit = 3,
}: { project: Product; limit?: number }) {
  const [items, setItems] = useState<DevLog[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/devlogs/recent?project=${project}&limit=${limit}`, { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        setItems(await res.json());
      } catch (e: any) {
        setErr(e?.message || "DevLogs konnten nicht geladen werden.");
      }
    })();
  }, [project, limit]);

  if (err) {
    return <p className="text-sm text-red-200">{err}</p>;
  }
  if (!items) {
    return <p className="text-sm text-white/60">Lädt …</p>;
  }
  if (items.length === 0) {
    return <p className="text-sm text-white/60">Noch keine Einträge.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((log) => (
        <div
          key={log.id}
          className="rounded-xl bg-white text-black/90 shadow/10 p-3"
        >
          <div className="text-[11px] text-black/50">{fmtDate(log.created_at)}</div>
          <div className="mt-1 font-semibold leading-snug">{log.title}</div>
          <div className="text-sm mt-1 text-black/70">{excerpt(log.body)}</div>
        </div>
      ))}

      {/* „Alle Updates“ – Ziel kannst du später auf eine Detail-/Listenroute legen */}
      <Link
        href={`/updates?project=${project}#devlogs`}
        className="inline-flex items-center justify-center rounded-lg border border-white/30 px-4 py-2 text-sm text-white/80 hover:border-white/50"
      >
        Alle Updates
      </Link>
    </div>
  );
}
