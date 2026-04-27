"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase ───────────────────────────────────────────────────────────────────
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Types ──────────────────────────────────────────────────────────────────────
type Tenant  = { id: string; atelier: string; name: string; betrag: number };
type Payment = { id: string; tenant_id: string; year: number; month: number; date: string };
type Tab     = "dashboard" | "zahlungen" | "mieter" | "csv";

// ── Constants ──────────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const PW     = process.env.NEXT_PUBLIC_ATELIER_PASSWORD ?? "atelier2026";
const SK     = "atelier_v1";

// ── Helpers ────────────────────────────────────────────────────────────────────
function euro(n: number) {
  return n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}
function parseDeNum(s: string) {
  return parseFloat(s.replace(/\./g, "").replace(",", "."));
}
function isoToDisplay(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

// ── Password Gate ──────────────────────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (val === PW) {
      sessionStorage.setItem(SK, "1");
      onAuth();
    } else {
      setErr(true);
      setVal("");
    }
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="w-full max-w-xs space-y-5 text-center">
        <h1 className="text-2xl font-semibold">Atelier Verwaltung</h1>
        <p className="text-sm text-white/50">Passwort erforderlich</p>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr(false); }}
            autoFocus
            placeholder="Passwort"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-white/40 focus:outline-none transition"
          />
          {err && <p className="text-sm text-red-400">Falsches Passwort</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-white py-3 font-medium text-black hover:bg-white/90 transition"
          >
            Weiter →
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
function Dashboard({ tenants }: { tenants: Tenant[] }) {
  const now = new Date();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await sb
        .from("payments")
        .select("*")
        .eq("year",  now.getFullYear())
        .eq("month", now.getMonth() + 1);
      setPayments(data ?? []);
      setLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalMonthly = tenants.reduce((s, t) => s + t.betrag, 0);
  const paidSet      = new Set(payments.map((p) => p.tenant_id));
  const paidTenants  = tenants.filter((t) => paidSet.has(t.id));
  const unpaid       = tenants.filter((t) => !paidSet.has(t.id));
  const paidAmount   = paidTenants.reduce((s, t) => s + t.betrag, 0);

  const stats = [
    { label: "Mieter gesamt",                    value: String(tenants.length) },
    { label: "Soll / Monat",                     value: euro(totalMonthly) },
    { label: `Bezahlt (${paidTenants.length}/${tenants.length})`, value: euro(paidAmount) },
    { label: "Offen",                             value: euro(totalMonthly - paidAmount) },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        {MONTHS[now.getMonth()]} {now.getFullYear()}
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
            <div className="text-xs text-white/50">{s.label}</div>
            <div className="text-xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {!loading && tenants.length > 0 && unpaid.length === 0 && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-sm text-green-300">
          ✓ Alle Mieter haben diesen Monat bezahlt
        </div>
      )}

      {!loading && unpaid.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-white/50">Noch nicht bezahlt</p>
          <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
            {unpaid
              .slice()
              .sort((a, b) => a.atelier.localeCompare(b.atelier))
              .map((t) => (
                <div key={t.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <span className="font-medium">{t.name}</span>
                    <span className="ml-2 text-sm text-white/50">Nr. {t.atelier}</span>
                  </div>
                  <span className="text-white/70">{euro(t.betrag)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Payments Tab ───────────────────────────────────────────────────────────────
function PaymentsTab({ tenants }: { tenants: Tenant[] }) {
  const now = new Date();
  const [year,     setYear]     = useState(now.getFullYear());
  const [month,    setMonth]    = useState(now.getMonth() + 1);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading,   setLoading]  = useState(false);
  const [busy,      setBusy]     = useState<string | null>(null);
  const [multiPick, setMultiPick] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await sb.from("payments").select("*").eq("year", year).eq("month", month);
    setPayments(data ?? []);
    setLoading(false);
  }, [year, month]);

  useEffect(() => { load(); }, [load]);

  const paidMap = new Map(payments.map((p) => [p.tenant_id, p]));

  async function toggle(t: Tenant) {
    setBusy(t.id);
    const existing = paidMap.get(t.id);
    if (existing) {
      await sb.from("payments").delete().eq("id", existing.id);
    } else {
      await sb.from("payments").insert({
        tenant_id: t.id,
        year,
        month,
        date: new Date().toISOString().slice(0, 10),
      });
    }
    await load();
    setBusy(null);
  }

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];
  const sorted = tenants.slice().sort((a, b) => a.atelier.localeCompare(b.atelier));
  const paidAmount = sorted.filter((t) => paidMap.has(t.id)).reduce((s, t) => s + t.betrag, 0);
  const total      = sorted.reduce((s, t) => s + t.betrag, 0);

  return (
    <div className="space-y-4">
      {/* Picker */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm"
        >
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <div className="flex flex-wrap gap-1">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              onClick={() => setMonth(i + 1)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                month === i + 1
                  ? "bg-white text-black font-medium"
                  : "border border-white/15 text-white/70 hover:border-white/40"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-white/50">Lädt…</p>
      ) : (
        <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
          {sorted.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-white/50">Keine Mieter vorhanden</p>
          )}
          {sorted.map((t) => {
            const paid = paidMap.get(t.id);
            const isOpen = multiPick === t.id;
            return (
              <div key={t.id}>
                <div className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition">
                  <button
                    onClick={() => toggle(t)}
                    disabled={busy === t.id}
                    className={`h-5 w-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition ${
                      paid
                        ? "border-green-400 bg-green-400 text-black"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    {paid && <span className="text-xs font-bold leading-none">✓</span>}
                  </button>
                  <div className="flex-1">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-white/50">Atelier {t.atelier}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/80">{euro(t.betrag)}</div>
                    {paid && (
                      <div className="text-xs text-white/40">{isoToDisplay(paid.date)}</div>
                    )}
                  </div>
                  <button
                    onClick={() => setMultiPick(isOpen ? null : t.id)}
                    className={`rounded-md border px-2.5 py-1 text-xs transition ${
                      isOpen
                        ? "border-white/40 text-white"
                        : "border-white/15 text-white/40 hover:border-white/40 hover:text-white/70"
                    }`}
                  >
                    Monate
                  </button>
                </div>
                {isOpen && (
                  <MultiMonthPicker
                    tenant={t}
                    year={year}
                    onClose={() => setMultiPick(null)}
                    onRefresh={load}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="flex justify-between border-t border-white/10 pt-3 text-sm text-white/50">
        <span>Bezahlt: {payments.length} / {tenants.length}</span>
        <span>{euro(paidAmount)} / {euro(total)}</span>
      </div>
    </div>
  );
}

// ── Tenants Tab ────────────────────────────────────────────────────────────────
function TenantsTab({ tenants, onRefresh }: { tenants: Tenant[]; onRefresh: () => void }) {
  const empty = { atelier: "", name: "", betrag: 0 };
  const [form,    setForm]    = useState<Omit<Tenant, "id">>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving,  setSaving]  = useState(false);

  function field<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    if (!form.atelier || !form.name || !form.betrag) return;
    setSaving(true);
    if (editing) {
      await sb.from("tenants").update(form).eq("id", editing);
      setEditing(null);
    } else {
      await sb.from("tenants").insert(form);
    }
    setForm(empty);
    setSaving(false);
    onRefresh();
  }

  async function del(id: string) {
    if (!confirm("Mieter wirklich löschen? Alle Zahlungseinträge bleiben erhalten.")) return;
    await sb.from("tenants").delete().eq("id", id);
    onRefresh();
  }

  function startEdit(t: Tenant) {
    setEditing(t.id);
    setForm({ atelier: t.atelier, name: t.name, betrag: t.betrag });
  }

  function cancel() {
    setEditing(null);
    setForm(empty);
  }

  const sorted = tenants.slice().sort((a, b) => a.atelier.localeCompare(b.atelier));

  return (
    <div className="space-y-5">
      {/* Form */}
      <div className="rounded-xl border border-white/15 bg-white/5 p-4 space-y-3">
        <h3 className="text-sm font-medium text-white/70">
          {editing ? "Mieter bearbeiten" : "Neuer Mieter"}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            placeholder="Atelier-Nr."
            value={form.atelier}
            onChange={(e) => field("atelier", e.target.value)}
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm placeholder-white/30 focus:border-white/40 focus:outline-none"
          />
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => field("name", e.target.value)}
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm placeholder-white/30 focus:border-white/40 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Betrag (€)"
            value={form.betrag || ""}
            onChange={(e) => field("betrag", Number(e.target.value))}
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm placeholder-white/30 focus:border-white/40 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving || !form.atelier || !form.name || !form.betrag}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50 hover:bg-white/90 transition"
          >
            {saving ? "Speichert…" : editing ? "Aktualisieren" : "Hinzufügen"}
          </button>
          {editing && (
            <button
              onClick={cancel}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 hover:border-white/40 transition"
            >
              Abbrechen
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
        {sorted.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-white/50">Noch keine Mieter</p>
        )}
        {sorted.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center gap-4 px-4 py-3">
            <div className="w-16 text-sm text-white/50">Nr. {t.atelier}</div>
            <div className="flex-1 min-w-0 font-medium truncate">{t.name}</div>
            <div className="text-white/70 tabular-nums">{euro(t.betrag)}</div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(t)}
                className="rounded-md border border-white/15 px-3 py-1 text-xs text-white/70 hover:border-white/40 transition"
              >
                Bearbeiten
              </button>
              <button
                onClick={() => del(t.id)}
                className="rounded-md border border-red-500/30 px-3 py-1 text-xs text-red-300 hover:border-red-500/60 transition"
              >
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>

      {sorted.length > 0 && (
        <div className="flex justify-end text-sm text-white/50 border-t border-white/10 pt-2">
          Gesamt: {euro(sorted.reduce((s, t) => s + t.betrag, 0))} / Monat
        </div>
      )}
    </div>
  );
}

// ── Multi-Month Picker ─────────────────────────────────────────────────────────
function MultiMonthPicker({
  tenant, year, onClose, onRefresh,
}: { tenant: Tenant; year: number; onClose: () => void; onRefresh: () => void }) {
  const [yearPayments, setYearPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await sb.from("payments").select("*").eq("tenant_id", tenant.id).eq("year", year);
      setYearPayments(data ?? []);
      setLoading(false);
    })();
  }, [tenant.id, year]);

  async function toggle(mo: number) {
    setBusy(mo);
    const existing = yearPayments.find((p) => p.month === mo);
    if (existing) {
      await sb.from("payments").delete().eq("id", existing.id);
      setYearPayments((ps) => ps.filter((p) => p.month !== mo));
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await sb
        .from("payments")
        .insert({ tenant_id: tenant.id, year, month: mo, date: today })
        .select()
        .single();
      if (data) setYearPayments((ps) => [...ps, data as Payment]);
    }
    setBusy(null);
    onRefresh();
  }

  const paidMonths = new Set(yearPayments.map((p) => p.month));

  return (
    <div className="border-t border-white/10 bg-black/20 px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">{tenant.name} — {year}</span>
        <button onClick={onClose} className="text-xs text-white/40 hover:text-white/70 transition">
          ✕ Schließen
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-white/50">Lädt…</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {MONTHS.map((m, i) => {
            const mo = i + 1;
            const paid = paidMonths.has(mo);
            return (
              <button
                key={mo}
                onClick={() => toggle(mo)}
                disabled={busy === mo}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  paid
                    ? "bg-green-500/20 border border-green-500/50 text-green-300"
                    : "border border-white/15 text-white/50 hover:border-white/40 hover:text-white/80"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── CSV Import ─────────────────────────────────────────────────────────────────
type CsvRow = { date: string; rawName: string; amount: number; matched: Tenant | null; months: number };

function CsvImport({ tenants, onDone }: { tenants: Tenant[]; onDone: () => void }) {
  const now = new Date();
  const [rows,      setRows]      = useState<CsvRow[]>([]);
  const [year,      setYear]      = useState(now.getFullYear());
  const [month,     setMonth]     = useState(now.getMonth() + 1);
  const [importing, setImporting] = useState(false);
  const [result,    setResult]    = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const headerIdx = lines.findIndex(
      (l) => l.toLowerCase().includes("buchungstag") || l.toLowerCase().includes("buchung")
    );
    if (headerIdx === -1) {
      alert("Kein gültiges Commerzbank-CSV erkannt.\nBitte als CSV exportieren: Online-Banking → Umsätze → Export.");
      return;
    }

    function splitLine(line: string): string[] {
      const out: string[] = [];
      let cur = "";
      let inQ = false;
      for (const ch of line) {
        if (ch === '"')      { inQ = !inQ; }
        else if (ch === ";" && !inQ) { out.push(cur.trim()); cur = ""; }
        else                 { cur += ch; }
      }
      out.push(cur.trim());
      return out;
    }

    const headers = splitLine(lines[headerIdx]).map((h) => h.toLowerCase());
    const dateCol   = headers.findIndex((h) => h.includes("buchungstag"));
    const nameCol   = headers.findIndex((h) => h.includes("begünstigter") || h.includes("auftraggeber"));
    const amountCol = headers.findIndex((h) => h.includes("betrag"));

    if (dateCol === -1 || nameCol === -1 || amountCol === -1) {
      alert("Spalten nicht erkannt. Bitte prüfen ob es ein Commerzbank-Export ist.");
      return;
    }

    const parsed: CsvRow[] = [];
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const cols = splitLine(lines[i]);
      if (cols.length < Math.max(dateCol, nameCol, amountCol) + 1) continue;

      const rawAmount = parseDeNum(cols[amountCol]);
      if (isNaN(rawAmount) || rawAmount <= 0) continue; // nur Eingänge

      const rawName = cols[nameCol];
      const matched = tenants.find((t) =>
        rawName.toLowerCase().includes(t.name.toLowerCase()) ||
        t.name.toLowerCase().split(" ").some((part) => part.length > 3 && rawName.toLowerCase().includes(part))
      ) ?? null;

      // Mehrmonatszahlung erkennen: Betrag ≈ N × Monatsmiete (Toleranz 12%)
      const ratio   = matched ? rawAmount / matched.betrag : 1;
      const rounded = Math.round(ratio);
      const months  = (matched && rounded >= 1 && rounded <= 12 && Math.abs(ratio - rounded) / rounded < 0.12)
        ? rounded : 1;

      // DD.MM.YYYY → YYYY-MM-DD
      const parts = cols[dateCol].split(".");
      const isoDate = parts.length === 3
        ? `${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`
        : cols[dateCol];

      parsed.push({ date: isoDate, rawName, amount: rawAmount, matched, months });
    }

    if (parsed.length === 0) {
      alert("Keine Eingangszahlungen in der Datei gefunden.");
      return;
    }

    setRows(parsed);
    setResult(null);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => parseCSV(ev.target?.result as string);
    reader.readAsText(file, "windows-1252");
  }

  async function importMatched() {
    const matched = rows.filter((r) => r.matched !== null);
    if (!matched.length) return;
    setImporting(true);
    let count = 0;
    for (const row of matched) {
      if (!row.matched) continue;
      // Bei Mehrmonatszahlung: aktueller Monat + N-1 Monate rückwärts
      for (let offset = 0; offset < row.months; offset++) {
        let tMonth = month - offset;
        let tYear  = year;
        while (tMonth <= 0) { tMonth += 12; tYear--; }
        const { data: ex } = await sb
          .from("payments").select("id")
          .eq("tenant_id", row.matched.id)
          .eq("year", tYear).eq("month", tMonth).limit(1);
        if (!ex || ex.length === 0) {
          await sb.from("payments").insert({
            tenant_id: row.matched.id, year: tYear, month: tMonth, date: row.date,
          });
          count++;
        }
      }
    }
    setImporting(false);
    setRows([]);
    setResult(`${count} Zahlungen importiert${count < matched.length ? `, ${matched.length - count} bereits vorhanden` : ""}.`);
    if (fileRef.current) fileRef.current.value = "";
    onDone();
  }

  const matchedCount = rows.filter((r) => r.matched).length;
  const totalMonths  = rows.filter((r) => r.matched).reduce((s, r) => s + r.months, 0);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/15 bg-white/5 p-4 space-y-4">
        <h3 className="text-sm font-medium text-white/70">Commerzbank CSV importieren</h3>
        <p className="text-xs text-white/40">
          Online-Banking → Umsätze → Zeitraum wählen → Export als CSV (Semikolon-getrennt)
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/60">Monat:</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm"
            >
              {[now.getFullYear() - 1, now.getFullYear()].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm"
            >
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <label className="cursor-pointer rounded-lg border border-white/25 px-4 py-2 text-sm text-white/80 hover:border-white/50 transition">
            CSV wählen
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>
      </div>

      {result && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
          ✓ {result}
        </div>
      )}

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">
              <span className="text-white font-medium">{matchedCount}</span> von {rows.length} Zeilen erkannt
            </p>
            <button
              onClick={importMatched}
              disabled={importing || matchedCount === 0}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50 hover:bg-white/90 transition"
            >
              {importing ? "Importiert…" : totalMonths > matchedCount ? `${matchedCount} Zeilen (${totalMonths} Monate) importieren` : `${matchedCount} importieren`}
            </button>
          </div>

          <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5 text-sm overflow-hidden">
            <div className="grid grid-cols-[1rem_6rem_1fr_7rem_4rem_8rem] gap-3 px-4 py-2 text-xs text-white/40 font-medium uppercase tracking-wide">
              <span /> <span>Datum</span> <span>Name</span> <span>Betrag</span> <span>Monate</span> <span>Erkannt als</span>
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1rem_6rem_1fr_7rem_4rem_8rem] items-center gap-3 px-4 py-3 ${!row.matched ? "opacity-35" : ""}`}
              >
                <div className={`h-2 w-2 rounded-full ${row.matched ? "bg-green-400" : "bg-white/20"}`} />
                <div className="text-white/50 text-xs">{isoToDisplay(row.date)}</div>
                <div className="truncate">{row.rawName}</div>
                <div className="tabular-nums text-white/70">{euro(row.amount)}</div>
                <div className="text-xs text-center">
                  {row.months > 1
                    ? <span className="rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 px-1.5 py-0.5">{row.months}×</span>
                    : <span className="text-white/30">1×</span>}
                </div>
                <div className="text-xs text-white/50 truncate">
                  {row.matched ? row.matched.name : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "zahlungen", label: "Zahlungen" },
  { id: "mieter",    label: "Mieter" },
  { id: "csv",       label: "CSV Import" },
];

function AtelierApp() {
  const [tab,     setTab]     = useState<Tab>("dashboard");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTenants = useCallback(async () => {
    const { data } = await sb.from("tenants").select("*").order("atelier");
    setTenants(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadTenants(); }, [loadTenants]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Atelier Verwaltung</h1>
        {!loading && (
          <span className="text-sm text-white/40">{tenants.length} Mieter</span>
        )}
      </div>

      <div className="flex gap-1 border-b border-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm transition ${
              tab === t.id
                ? "border-white font-medium text-white"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-white/50">Lädt…</p>
      ) : (
        <>
          {tab === "dashboard" && <Dashboard tenants={tenants} />}
          {tab === "zahlungen" && <PaymentsTab tenants={tenants} />}
          {tab === "mieter"    && <TenantsTab tenants={tenants} onRefresh={loadTenants} />}
          {tab === "csv"       && <CsvImport  tenants={tenants} onDone={loadTenants} />}
        </>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AtelierPage() {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    setAuth(sessionStorage.getItem(SK) === "1");
  }, []);

  if (auth === null) return null;
  if (!auth) return <PasswordGate onAuth={() => setAuth(true)} />;
  return <AtelierApp />;
}
