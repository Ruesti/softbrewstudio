"use client";

import { useEffect, useState } from "react";

/* =========================================
   Config
========================================= */
type Product = "focuspilot" | "hardware-copilot";

const PRODUCTS: { id: Product; title: string; accent: string; description: string }[] = [
  { id: "focuspilot",       title: "FocusPilot",       accent: "#7C3AED", description: "AI co-pilot for project memory, decisions, and instant re-entry." },
  { id: "hardware-copilot", title: "Hardware Copilot", accent: "#D97706", description: "AI desktop assistant from concept to component list. For hobbyists." },
];

/* =========================================
   Utils
========================================= */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "2-digit" });
}
function excerpt(s: string, n = 140) {
  const t = s
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
}
function isImg(url: string) {
  return /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(url);
}
function pickThumb(links: any): string | null {
  try {
    if (!links) return null;
    if (typeof links === "string") return isImg(links) ? links : pickThumb(JSON.parse(links));
    if (Array.isArray(links)) {
      const s = links.find((x) => typeof x === "string" && isImg(x));
      if (s) return s as string;
      const o = links.find((x) => typeof x === "object" && x && typeof x.url === "string" && isImg(x.url));
      if (o) return (o as any).url;
    }
    if (typeof links === "object") {
      for (const k of ["image", "thumbnail", "thumb", "cover", "url"]) {
        const v: any = (links as any)[k];
        if (typeof v === "string" && isImg(v)) return v;
        if (v && typeof v.url === "string" && isImg(v.url)) return v.url;
      }
      const vals = Object.values(links);
      const str = vals.find((v) => typeof v === "string" && isImg(v as string));
      if (str) return str as string;
    }
  } catch {}
  return null;
}

/* =========================================
   Types for API response
========================================= */
type DevLog = {
  id: string;
  project: Product;
  created_at: string; // from 'date'
  title: string;
  body: string;       // from 'summary'
  links?: any;
};

/* =========================================
   Fetch Hook DevLogs
========================================= */
function useDevLogs(project: Product, limit = 3) {
  const [items, setItems] = useState<DevLog[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/devlogs/recent?project=${project}&limit=${limit}`, { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as DevLog[];
        if (!cancelled) setItems(data);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "DevLogs konnten nicht geladen werden.");
      }
    })();
    return () => { cancelled = true; };
  }, [project, limit]);

  return { items, err };
}

/* =========================================
   Beta: Modal + Start-Button (ohne Feld auf der Seite)
========================================= */
function BetaModal({
  product,
  open,
  onClose,
  onSuccess,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!open) return null;

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/beta/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, password: pw }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Passwort falsch.");
      onSuccess();
    } catch (e: any) {
      setMsg(e?.message || "Zugriff verweigert.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-neutral-900 p-5 shadow-xl">
        <h3 className="text-lg font-semibold">Beta-Zugang</h3>
        <p className="mt-1 text-sm text-white/70">
          Bitte einmalig das Beta-Passwort eingeben. Danach bleibst du 14 Tage eingeloggt.
        </p>

        <div className="mt-4 flex gap-2">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Beta-Passwort"
            className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm"
            autoFocus
          />
          <button
            onClick={submit}
            disabled={loading || pw.length === 0}
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {loading ? "Prüfe…" : "Los"}
          </button>
        </div>

        {msg && <p className="mt-2 text-xs text-red-200">{msg}</p>}

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="text-sm text-white/70 hover:text-white">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}

function BetaStartButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  async function go() {
    setChecking(true);
    try {
      const res = await fetch(`/api/beta/status?product=${product}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.authorized) {
        window.location.href = `/beta/${product}`;
      } else {
        setOpen(true);
      }
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <button
        onClick={go}
        className="inline-flex items-center justify-center rounded-lg border border-white/35 px-3 py-1.5 text-sm text-white/90 hover:border-white/60"
      >
        {checking ? "Prüfe…" : "Beta starten"}
      </button>

      <BetaModal
        product={product}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          window.location.href = `/beta/${product}`;
        }}
      />
    </>
  );
}

/* =========================================
   Beta Footer (open vs coming_soon) + Warteliste
========================================= */
function BetaFooter({ productId }: { productId: Product }) {
  const [state, setState] = useState<"open" | "coming_soon" | "loading">("loading");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/beta/config?product=${productId}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok) setState(data.state);
        else setState("open"); // fallback
      } catch {
        setState("open");
      }
    })();
  }, [productId]);

  if (state === "loading") {
    return <div className="mt-2 text-sm text-white/60">Lädt…</div>;
  }

  if (state === "coming_soon") {
    return (
      <div className="mt-2 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-md border border-white/30 px-3 py-1.5 text-sm text-white/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-400" />
          Beta kommt bald
        </div>

        {/* Warteliste */}
        <div className="flex gap-2 pt-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Vorab anmelden – deine@email.de"
            className="flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-1.5 text-sm"
          />
          <button
            onClick={async () => {
              setSending(true); setMsg(null);
              try {
                const res = await fetch("/api/beta/waitlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ product: productId, email }),
                });
                if (!res.ok) throw new Error(await res.text());
                setMsg("Danke! Wir melden uns.");
                setEmail("");
              } catch (e: any) {
                setMsg(e?.message || "Konnte nicht gespeichert werden.");
              } finally { setSending(false); }
            }}
            disabled={sending || !email}
            className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black disabled:opacity-50"
          >
            {sending ? "Sende…" : "Anmelden"}
          </button>
        </div>
        {msg && <p className="text-[12px] text-white/70">{msg}</p>}
      </div>
    );
  }

  // state === "open"
  return (
    <div className="mt-2 flex items-center gap-3">
      <a
        href={`/updates/${productId}`}
        className="inline-flex items-center justify-center rounded-lg border border-white/35 px-3 py-1.5 text-sm text-white/90 hover:border-white/60"
      >
        Alle Updates →
      </a>
      <BetaStartButton product={productId} />
    </div>
  );
}

/* =========================================
   DevLog Column (one product)
========================================= */
function DevLogColumn({ p }: { p: (typeof PRODUCTS)[number] }) {
  const { items, err } = useDevLogs(p.id, 3);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.accent }} />
        <h3 className="text-lg font-semibold">{p.title}</h3>
      </div>
      <p className="text-sm text-white/60">{p.description}</p>

      {err && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-sm text-red-200">
          {err}
        </div>
      )}
      {!items && !err && (
        <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm text-white/70">
          Lädt …
        </div>
      )}
      {items?.length === 0 && (
        <div className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm text-white/80">
          Noch keine Einträge.
        </div>
      )}

      {items?.map((log) => {
        const thumb = pickThumb(log.links);
        return (
          <article
            key={log.id}
            className="group rounded-xl border border-white/25 bg-white/10 p-3 backdrop-blur transition
                       hover:border-white/60 hover:bg-white/15 hover:shadow-lg hover:shadow-black/20
                       active:scale-[0.99]"
          >
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-white/70">
              <span>{p.id}</span>
              <time>{fmtDate(log.created_at)}</time>
            </div>
            <h4 className="mt-1 text-base font-semibold text-white">{log.title}</h4>

            <div className="mt-2 flex gap-3">
              {thumb && (
                <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                </div>
              )}
              <p className="text-sm text-white/80">{excerpt(log.body)}</p>
            </div>
          </article>
        );
      })}

      {/* CTA & Beta-State / Warteliste */}
      <BetaFooter productId={p.id} />
    </section>
  );
}

/* =========================================
   Page
========================================= */
export default function UpdatesPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Updates</h1>
        <p className="text-white/75">
          Neuigkeiten & DevLogs – mit schnellem Zugang zu Beta oder Warteliste.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {PRODUCTS.map((p) => (
          <DevLogColumn key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
