"use client";

import { useEffect, useState } from "react";

type Product = "focuspilot" | "shiftrix" | "linguai";
type Item = { product: Product; state: "open" | "coming_soon"; password: string };

export default function BetaAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [items, setItems] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    if (!adminKey) { setMsg("Bitte Admin-Key eingeben."); return; }
    setLoading(true); setMsg(null);
    try {
      const res = await fetch("/api/beta/admin/config", {
        headers: { "X-Admin-Key": adminKey },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Fehler");
      setItems(data.items as Item[]);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Konnte Daten nicht laden.");
      setItems(null);
    } finally { setLoading(false); }
  }

  async function saveOne(p: Product, patch: Partial<Item>) {
    if (!adminKey) { setMsg("Admin-Key fehlt."); return; }
    setLoading(true); setMsg(null);
    try {
      const res = await fetch("/api/beta/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Key": adminKey },
        body: JSON.stringify({ product: p, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Speichern fehlgeschlagen");
      setMsg("Gespeichert.");
      // UI aktualisieren
      setItems(prev => prev?.map(it => it.product === p ? { ...it, ...patch } as Item : it) ?? null);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Fehler beim Speichern.");
    } finally { setLoading(false); }
  }

  useEffect(() => { /* nix */ }, []);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Beta-Admin</h1>

      {/* Admin-Key Eingabe */}
      <div className="rounded-xl border border-white/15 bg-white/5 p-4">
        <label className="text-sm text-white/80">Admin-Key</label>
        <div className="mt-2 flex gap-2">
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="ADMIN_KEY aus .env"
            className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2"
          />
          <button
            onClick={load}
            className="rounded-lg bg-white px-4 py-2 text-black font-medium"
            disabled={loading || !adminKey}
          >
            {loading ? "Lade…" : "Laden"}
          </button>
        </div>
        {msg && <p className="mt-2 text-sm text-white/70">{msg}</p>}
      </div>

      {/* Liste */}
      {items && (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.product} className="rounded-xl border border-white/15 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold capitalize">{it.product}</div>
                <div className="text-xs text-white/60">Status & Passwort</div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {/* Status */}
                <div>
                  <label className="text-sm text-white/80">Status</label>
                  <div className="mt-1 flex gap-2">
                    <select
                      className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2"
                      value={it.state}
                      onChange={(e) => saveOne(it.product, { state: e.target.value as Item["state"] })}
                    >
                      <option value="open">open</option>
                      <option value="coming_soon">coming_soon</option>
                    </select>
                  </div>
                </div>

                {/* Passwort */}
                <div>
                  <label className="text-sm text-white/80">Beta-Passwort</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2"
                      defaultValue={it.password}
                      placeholder="neues Passwort…"
                      onBlur={(e) => {
                        const v = e.currentTarget.value;
                        if (v !== it.password) saveOne(it.product, { password: v });
                      }}
                    />
                    <button
                      className="rounded-lg border border-white/30 px-3 py-2 text-sm text-white/90 hover:border-white/60"
                      onClick={() => saveOne(it.product, { password: "" })}
                      title="Passwort leeren"
                    >
                      Leeren
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
