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

function isApiResponse(j: unknown): j is ApiResponse {
  return !!j && typeof j === "object" && "ok" in j;
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
        const err = (j as { error?: string })?.error ?? res.statusText;
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
      {/* dein JSX bleibt unverändert */}
      ...
    </PageShell>
  );
}

