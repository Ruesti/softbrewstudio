// src/app/admin/devlogs/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import { Card } from "@/components/Card";

type Project = "focuspilot" | "shiftrix" | "linguai";
type LinkItem = { label: string; href: string };
type DevlogRow = {
  id: string;
  project: Project;
  date: string;
  title: string;
  summary: string;
  tags?: string[];
  links?: LinkItem[];
};

type ListResponse = {
  data: DevlogRow[];
  error?: string;
};

type ApiResponse =
  | { ok: true; data?: unknown }
  | { ok: false; error: string };

const isUUID = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

<<<<<<< Updated upstream
function isApiResponse(j: unknown): j is ApiResponse {
  return !!j && typeof j === "object" && "ok" in j;
=======
function hasError(obj: unknown): obj is { error: string } {
  return !!obj && typeof obj === "object" && "error" in obj;
}
function isApiResponse(obj: unknown): obj is ApiResponse {
  return !!obj && typeof obj === "object" && "ok" in obj;
>>>>>>> Stashed changes
}

export default function AdminDevlogsPage() {
  const [activeProject, setActiveProject] = useState<Project>("focuspilot");

  // Formular
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string>("");
  const [links, setLinks] = useState<LinkItem[]>([{ label: "", href: "" }]);
  const [adminKey, setAdminKey] = useState("");

  // Liste
  const [rows, setRows] = useState<DevlogRow[]>([]);
  const [status, setStatus] = useState("");

  const canSubmit = useMemo(
    () => adminKey.trim() && title.trim() && summary.trim() && (!editingId || isUUID(editingId)),
    [adminKey, title, summary, editingId]
  );

  async function loadList(p: Project = activeProject) {
    setStatus("Lade Liste…");
    try {
      const url = `/api/devlogs/list?project=${encodeURIComponent(p)}&limit=10`;
      const res: Response = await fetch(url, { cache: "no-store" });
      const text = await res.text();

      let j: unknown = null;
      try {
        j = text ? JSON.parse(text) : null;
      } catch {
        setStatus(`Fehler ${res.status}: Antwort war kein JSON.`);
        setRows([]);
        return;
      }

      if (!res.ok) {
<<<<<<< Updated upstream
        const err = (j as { error?: string })?.error ?? res.statusText;
=======
        const err = hasError(j) ? j.error : res.statusText;
>>>>>>> Stashed changes
        setStatus(`Fehler ${res.status}: ${err}`);
        setRows([]);
        return;
      }

      const lr = j as ListResponse;
      setRows(Array.isArray(lr.data) ? lr.data : []);
      setStatus("");
    } catch (err) {
      const e = err as Error;
      setStatus(`Netzwerkfehler: ${e.message}`);
      setRows([]);
    }
  }

  useEffect(() => {
    void loadList(activeProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject]);

  function resetForm() {
    setEditingId(null);
    setDate(new Date().toISOString().slice(0, 10));
    setTitle("");
    setSummary("");
    setTags("");
    setLinks([{ label: "", href: "" }]);
  }

  function fillFormFromRow(r: DevlogRow) {
<<<<<<< Updated upstream
=======
    // Beim Bearbeiten den gemeinsamen Selector auf das Projekt des Eintrags stellen
>>>>>>> Stashed changes
    setActiveProject(r.project);
    setEditingId(r.id);
    setDate(r.date);
    setTitle(r.title);
    setSummary(r.summary);
    setTags((r.tags || []).join(", "));
    setLinks(r.links && r.links.length ? r.links : [{ label: "", href: "" }]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sende…");

    const payload = {
      project: activeProject,
      date,
      title,
      summary,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      links: links.filter((l) => l.label && l.href),
    };

    let endpoint = "/api/devlogs";
    let method: "POST" | "PATCH" = "POST";

    if (editingId) {
      if (!isUUID(editingId)) {
        setStatus(`Fehler: ungültige ID (${editingId})`);
        return;
      }
      endpoint = `/api/devlogs/${encodeURIComponent(editingId)}`;
      method = "PATCH";
    }

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let j: unknown = null;
    try {
      j = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok || !isApiResponse(j) || !j.ok) {
      const msg = isApiResponse(j) && !j.ok ? j.error : text || res.statusText;
      setStatus(`Fehler ${res.status}: ${msg}`);
      return;
    }

    setStatus(method === "PATCH" ? "Aktualisiert ✓" : "Gespeichert ✓");
    await loadList(activeProject);
    resetForm();
  }

  async function remove(id: string) {
    if (!adminKey) {
      setStatus("Kein Admin-Key");
      return;
    }
    if (!isUUID(id)) {
      setStatus(`Fehler: ungültige ID (${id})`);
      return;
    }
    if (!confirm("Diesen Devlog wirklich löschen?")) return;

    const res = await fetch(`/api/devlogs/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });

    const text = await res.text();
    let j: unknown = null;
    try {
      j = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok || !isApiResponse(j) || !j.ok) {
      const msg = isApiResponse(j) && !j.ok ? j.error : text || res.statusText;
      setStatus(`Fehler ${res.status}: ${msg}`);
      return;
    }

    setStatus("Gelöscht ✓");
    await loadList(activeProject);
  }

  const addLink = () => setLinks([...links, { label: "", href: "" }]);
  const rmLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));

  return (
    <PageShell title="Devlogs – Admin" subtitle="Einträge anlegen, bearbeiten und löschen">
<<<<<<< Updated upstream
      {/* dein JSX bleibt unverändert */}
      ...
=======
      {/* Gemeinsamer Projekt-Selector */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm">Projekt</label>
        <select
          value={activeProject}
          onChange={(e) => setActiveProject(e.target.value as Project)}
          className="rounded-md border px-3 py-2 text-softbrew-black"
        >
          <option value="focuspilot">FocusPilot</option>
          <option value="shiftrix">Shiftrix</option>
          <option value="linguai">LinguAI</option>
        </select>
        <button
          onClick={() => void loadList(activeProject)}
          className="rounded-md border border-softbrew.gray/60 px-3 py-2 text-softbrew-black hover:bg-softbrew-gray"
        >
          Neu laden
        </button>
        {editingId && (
          <span className="ml-auto text-xs text-softbrew-mid">
            Bearbeite ID: <code>{editingId}</code>
          </span>
        )}
      </div>

      {/* Formular */}
      <Card className="bg-white text-softbrew-black">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm">Datum</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-softbrew-black"
              />
            </label>

            <label className="block">
              <span className="text-sm">Admin-Key</span>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-softbrew-black"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm">Titel</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-softbrew-black"
            />
          </label>

          <label className="block">
            <span className="text-sm">Summary</span>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2 text-softbrew-black"
            />
          </label>

          <label className="block">
            <span className="text-sm">Tags (Komma-getrennt)</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-softbrew-black"
              placeholder="UI, Design, DX"
            />
          </label>

          <div>
            <div className="text-sm mb-2">Links</div>
            <div className="space-y-2">
              {links.map((l, i) => (
                <div key={i} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    placeholder="Label"
                    value={l.label}
                    onChange={(e) => {
                      const v = [...links]; v[i].label = e.target.value; setLinks(v);
                    }}
                    className="rounded-md border px-3 py-2 text-softbrew-black"
                  />
                  <input
                    placeholder="https://…"
                    value={l.href}
                    onChange={(e) => {
                      const v = [...links]; v[i].href = e.target.value; setLinks(v);
                    }}
                    className="rounded-md border px-3 py-2 text-softbrew-black"
                  />
                  <button
                    type="button"
                    onClick={() => rmLink(i)}
                    className="rounded-md border border-softbrew.gray/60 px-3 py-2 text-softbrew-black hover:bg-softbrew-gray"
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLink}
              className="mt-2 rounded-md border border-softbrew.gray/60 px-3 py-2 text-softbrew-black hover:bg-softbrew-gray"
            >
              + Link hinzufügen
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-softbrew-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-40"
            >
              {editingId ? "Aktualisieren" : "Speichern"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-softbrew.gray/60 px-3 py-2 text-softbrew-black hover:bg-softbrew-gray"
              >
                Abbrechen
              </button>
            )}
            <span className="text-sm text-softbrew-mid">{status}</span>
          </div>
        </form>
      </Card>

      {/* Liste */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3">Letzte Einträge</h2>
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-softbrew.gray/60 bg-white p-4 shadow-sm text-softbrew-black"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-softbrew-mid/80">{r.id}</div>
                  <div className="text-sm text-softbrew-mid">
                    {r.date}
                    {r.tags?.length ? " · " + r.tags.join(" · ") : ""}
                  </div>
                  <div className="font-medium">{r.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-md border border-softbrew.gray/60 px-3 py-2 text-softbrew-black hover:bg-softbrew-gray"
                    onClick={() => fillFormFromRow(r)}
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="rounded-md border border-red-300 px-3 py-2 text-red-700 hover:bg-red-50"
                    onClick={() => void remove(r.id)}
                  >
                    Löschen
                  </button>
                </div>
              </div>
              {r.summary && <p className="mt-2 text-sm">{r.summary}</p>}
              {Array.isArray(r.links) && r.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {r.links.map((l, i) => (
                    <a
                      key={i}
                      href={l.href}
                      className="underline decoration-softbrew-blue underline-offset-2 hover:opacity-80"
                    >
                      {l.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-softbrew-mid text-sm">Keine Einträge gefunden.</div>
          )}
        </div>
      </div>
>>>>>>> Stashed changes
    </PageShell>
  );
}

