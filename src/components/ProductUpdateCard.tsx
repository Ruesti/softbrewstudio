"use client";

import { useState } from "react";

type Props = {
  product: "focuspilot" | "shiftrix" | "linguai";
  title: string;
  description: string;
  accent: string; // tailwind color hex or class
};

export default function ProductUpdateCard({ product, title, description, accent }: Props) {
  const [email, setEmail] = useState("");
  const [loadingNL, setLoadingNL] = useState(false);
  const [nlMsg, setNlMsg] = useState<string | null>(null);

  const [betaPw, setBetaPw] = useState("");
  const [loadingBeta, setLoadingBeta] = useState(false);
  const [betaMsg, setBetaMsg] = useState<string | null>(null);

  async function subscribeNewsletter() {
    setLoadingNL(true);
    setNlMsg(null);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Fehler beim Anmelden.");
      }
      setNlMsg("Angemeldet! Bitte prüfe deine E-Mails (falls Double-Opt-In aktiv).");
      setEmail("");
    } catch (e: any) {
      setNlMsg(e.message || "Etwas ist schiefgelaufen.");
    } finally {
      setLoadingNL(false);
    }
  }

  async function enterBeta() {
    setLoadingBeta(true);
    setBetaMsg(null);
    try {
      const res = await fetch("/api/beta/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, password: betaPw }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Passwort falsch.");
      }
      // Cookie ist jetzt gesetzt → zur Beta-Seite navigieren
      window.location.href = `/beta/${product}`;
    } catch (e: any) {
      setBetaMsg(e.message || "Zugriff verweigert.");
    } finally {
      setLoadingBeta(false);
      setBetaPw("");
    }
  }

  return (
    <div className="rounded-brand border border-white/10 bg-white/5 backdrop-blur p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full" style={{ background: accent }} />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-white/70">{description}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Newsletter */}
        <div className="rounded-brand border border-white/10 p-4">
          <h4 className="font-medium mb-2">Newsletter</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              onClick={subscribeNewsletter}
              disabled={loadingNL || !email}
              className="rounded-lg px-4 py-2 bg-white text-black font-medium disabled:opacity-50"
            >
              {loadingNL ? "Sende..." : "Anmelden"}
            </button>
          </div>
          {nlMsg && <p className="mt-2 text-sm text-white/70">{nlMsg}</p>}
        </div>

        {/* Beta */}
        <div className="rounded-brand border border-white/10 p-4">
          <h4 className="font-medium mb-2">Beta-Zugang</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={betaPw}
              onChange={(e) => setBetaPw(e.target.value)}
              placeholder="Beta-Passwort"
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              onClick={enterBeta}
              disabled={loadingBeta || betaPw.length === 0}
              className="rounded-lg px-4 py-2 bg-white text-black font-medium disabled:opacity-50"
            >
              {loadingBeta ? "Prüfe..." : "Los"}
            </button>
          </div>
          {betaMsg && <p className="mt-2 text-sm text-white/70">{betaMsg}</p>}
          <p className="mt-2 text-xs text-white/50">
            Zugriff nur mit Beta-Passwort. Teile es nicht öffentlich. 🙂
          </p>
        </div>
      </div>
    </div>
  );
}
