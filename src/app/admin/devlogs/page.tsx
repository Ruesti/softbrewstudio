// src/app/admin/devlogs/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import { Card } from "@/components/Card";

type Project = "focuspilot" | "shiftrix" | "linguai";
type PostType = "devlog" | "note";
type PostStatus = "draft" | "published";

type LinkItem = { label: string; href: string };

type DevlogRow = {
  id: string;
  project: Project;
  type: PostType;
  status: PostStatus;
  published_at?: string | null;

  date: string;
  title: string;

  // Short teaser (optional)
  summary: string;

  // Full text (Markdown)
  content_md: string;

  tags?: string[];
  links?: LinkItem[];
};

type ListResponse = { data?: DevlogRow[]; error?: string };
type ApiOK = { ok: true; data?: unknown };
type ApiErr = { ok: false; error: string };
type ApiResponse = ApiOK | ApiErr;

const isUUID = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

export default function AdminDevlogsPage() {
  // Shared selectors (control list + form)
  const [activeProject, setActiveProject] = useState<Project>("focuspilot");
  const [activeType, setActiveType] = useState<PostType>("devlog");

  // Form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [postStatus, setPostStatus] = useState<PostStatus>("draft");
  const [summary, setSummary] = useState("");
  const [contentMd, setContentMd] = useState("");
  const [tags, setTags] = useState<string>("");
  const [links, setLinks] = useState<LinkItem[]>([{ label: "", href: "" }]);
  const [adminKey, setAdminKey] = useState("");

  // List
  const [rows, setRows] = useState<DevlogRow[]>([]);
  const [status, setStatus] = useState("");

  const canSubmit = useMemo(
    () => Boolean(adminKey.trim() && title.trim() && contentMd.trim() && (!editingId || isUUID(editingId))),
    [adminKey, title, contentMd, editingId]
  );

async function loadList(p: Project = activeProject, t: PostType = activeType) {
  setStatus("Lade Liste…");
  try {
    if (!adminKey.trim()) {
      setStatus("Bitte Admin-Key eingeben");
      setRows([]);
      return;
    }

    const url = `/api/devlogs/list?project=${encodeURIComponent(p)}&type=${encodeURIComponent(t)}&limit=10`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: { "x-admin-key": adminKey },
    });

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
      const err = (j as ListResponse)?.error ?? res.statusText;
      setStatus(`Fehler ${res.status}: ${err}`);
      setRows([]);
      return;
    }

    const data = (j as ListResponse)?.data;
    setRows(Array.isArray(data) ? data : []);
    setStatus("");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setStatus(`Netzwerkfehler: ${msg}`);
    setRows([]);
  }
}


  // Reload list when selectors change
  useEffect(() => {
    void loadList(activeProject, activeType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject, activeType]);

  function resetForm() {
    setEditingId(null);
    setDate(new Date().toISOString().slice(0, 10));
    setTitle("");
    setPostStatus("draft");
    setSummary("");
    setContentMd("");
    setTags("");
    setLinks([{ label: "", href: "" }]);
  }

  function fillFormFromRow(r: DevlogRow) {
    setActiveProject(r.project);
    setActiveType(r.type);
    setEditingId(r.id);
    setDate(r.date);
    setTitle(r.title);
    setPostStatus(r.status ?? "draft");
    setSummary(r.summary ?? "");
    setContentMd(r.content_md ?? "");
    setTags((r.tags || []).join(", "));
    setLinks(r.links && r.links.length ? r.links : [{ label: "", href: "" }]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function isApiResponse(j: unknown): j is ApiResponse {
    return !!j && typeof j === "object" && "ok" in (j as Record<string, unknown>);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sende…");

    const payload = {
      project: activeProject,
      type: activeType,
      status: postStatus,
      date,
      title,
      summary, // teaser (optional)
      content_md: contentMd, // main text
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
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
    } catch {
      // ignore parse error; will be handled below
    }

    if (!res.ok || !isApiResponse(j) || !j.ok) {
      const msg = (isApiResponse(j) && !j.ok ? j.error : undefined) ?? text ?? res.statusText;
      setStatus(`Fehler ${res.status}: ${msg}`);
      return;
    }

    setStatus(method === "PATCH" ? "Aktualisiert ✓" : "Gespeichert ✓");
    await loadList(activeProject, activeType);
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
    if (!confirm("Diesen Eintrag wirklich löschen?")) return;

    const res = await fetch(`/api/devlogs/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });

    const text = await res.text();
    let j: unknown = null;
    try {
      j = text ? JSON.parse(text) : null;
    } catch {
      // ignore
    }

    if (!res.ok || !isApiResponse(j) || !j.ok) {
      const msg = (isApiResponse(j) && !j.ok ? j.error : undefined) ?? text ?? res.statusText;
      setStatus(`Fehler ${res.status}: ${msg}`);
      return;
    }

    setStatus("Gelöscht ✓");
    await loadList(activeProject, activeType);
  }

  const addLink = () => setLinks((cur) => [...cur, { label: "", href: "" }]);
  const rmLink = (i: number) => setLinks((cur) => cur.filter((_, idx) => idx !== i));

  function previewText(r: DevlogRow) {
    const t = (r.summary || "").trim() || (r.content_md || "").trim();
    if (!t) return "";
    return t.length > 220 ? t.slice(0, 220) + "…" : t;
  }

  return (
    <PageShell
      title="Content – Admin"
      subtitle="Devlogs und Notes anlegen, bearbeiten, veröffentlichen und löschen"
    >
      {/* Shared selectors */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
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

        <label className="text-sm">Typ</label>
        <select
          value={activeType}
          onChange={(e) => setActiveType(e.target.value as PostType)}
          className="rounded-md border px-3 py-2 text-softbrew-black"
        >
          <option value="devlog">Devlog</option>
          <option value="note">Note</option>
        </select>

        <button
          onClick={() => void loadList(activeProject, activeType)}
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

      {/* Form */}
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
              <span className="text-sm">Status</span>
              <select
                value={postStatus}
                onChange={(e) => setPostStatus(e.target.value as PostStatus)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-softbrew-black"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
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
            <span className="text-sm">Text (Markdown)</span>
            <textarea
              value={contentMd}
              onChange={(e) => setContentMd(e.target.value)}
              rows={14}
              className="mt-1 w-full rounded-md border px-3 py-2 text-softbrew-black"
              placeholder="Write your devlog / note here…"
            />
          </label>

          <label className="block">
            <span className="text-sm">Teaser / Summary (optional)</span>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2 text-softbrew-black"
              placeholder="Short preview text for list/SEO (optional)"
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
                      const v = [...links];
                      v[i].label = e.target.value;
                      setLinks(v);
                    }}
                    className="rounded-md border px-3 py-2 text-softbrew-black"
                  />
                  <input
                    placeholder="https://…"
                    value={l.href}
                    onChange={(e) => {
                      const v = [...links];
                      v[i].href = e.target.value;
                      setLinks(v);
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

      {/* List */}
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
                    {" · "}
                    <span className={r.status === "published" ? "text-green-700" : "text-softbrew-mid"}>
                      {r.status}
                    </span>
                    {r.tags?.length ? " · " + r.tags.join(" · ") : ""}
                  </div>

                  <div className="font-medium">{r.title}</div>

                  <div className="text-xs text-softbrew-mid/80">
                    {r.type} · {r.project}
                    {r.published_at ? ` · published ${String(r.published_at).slice(0, 10)}` : ""}
                  </div>
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

              {previewText(r) && <p className="mt-2 text-sm whitespace-pre-wrap">{previewText(r)}</p>}

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

          {rows.length === 0 && <div className="text-softbrew-mid text-sm">Keine Einträge gefunden.</div>}
        </div>
      </div>
    </PageShell>
  );
}
