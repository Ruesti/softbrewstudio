# Design: Blog-Serie „Mein eigener KI-Server" auf softbrewstudio.com

**Datum:** 2026-07-13
**Status:** Freigegeben (Brainstorming abgeschlossen)
**Repo:** softbrewstudio (Next.js 16, App Router)
**Branch:** `blog/ki-server`

## Ziel

Ein **persönlicher Blog mit technischen How-To-Teilen** über den Aufbau eines
selbstgehosteten KI-Setups: eigener NUC-Server, Tailscale-Netz, Claude headless
auf dem NUC, Claude-Agenten mit Cockpit, ComfyUI von Claude gesteuert, und
Fernsteuerung von Laptop/Handy. Erzählend, aber an den richtigen Stellen konkret
genug zum Nachbauen (Befehle, Configs, echte API-Endpunkte).

**Zielgruppe:** technisch interessierte Leser; öffentlich erreichbar.
**Form:** Serie aus 7 Artikeln (nicht ein Longread).

## Hosting-Entscheidung

Der Blog wird **in die bestehende Next.js-App auf Vercel integriert** — nicht auf
dem NUC gehostet. Begründung: Die App existiert bereits (Next.js 16 + Vercel +
Cloudflare-DNS), ein öffentlicher Blog soll nicht von der NUC-Verfügbarkeit
abhängen, und Next.js rendert Markdown/MDX-Blogs nativ und statisch. Die Ironie
(Blog erzählt über den NUC, läuft aber bewusst woanders) wird in Artikel 1
selbst thematisiert.

## Architektur

### Routen

```
/blog                    → Serien-Übersicht (Hero + Artikelliste, Teil 1–7)
/blog/[slug]             → einzelner Artikel (gerendertes MDX)
src/content/blog/*.mdx   → die 7 Artikel als Dateien
src/lib/blog.ts          → liest Frontmatter + Reihenfolge, liefert Metadaten
```

- Rein **statisch** vorgerendert (`generateStaticParams`) — kein Supabase, keine
  Laufzeit-Abhängigkeit.
- Nutzt das bestehende dunkle Layout (`layout.tsx`, `Background`, `BrandHeader`,
  Footer bleiben unverändert bestehen).
- Ein Link **„Blog"** wird im `BrandHeader` (bzw. der `PageShell`-Navigation)
  ergänzt.

### Content-Modell (Frontmatter je `.mdx`-Datei)

```yaml
---
title: "Teil 2: Tailscale – dein privates Netz über den ganzen Planeten"
part: 2                       # Reihenfolge der Serie
slug: "tailscale-privates-netz"
summary: "Wie aus NUC, Laptop und Handy ein einziges sicheres Netz wird."
date: "2026-07-13"
readingTime: "8 min"
tags: ["tailscale", "netzwerk", "wireguard"]
cover: "/blog/tailscale.png"  # optional
---
```

### Rendering-Pipeline

- **MDX-Rendering** via `next-mdx-remote` (oder Next-natives MDX — die für
  Next 16 + Turbopack sauberste Variante wird im Implementierungsplan
  festgelegt).
- **Frontmatter-Parsing** via `gray-matter`.
- **Code-Highlighting** via `rehype-pretty-code`/Shiki, dunkles Theme passend
  zum Seiten-Design (zentral für einen Technik-Blog).
- **Prosa** über eine Blog-Variante von `Prose`. Wichtig: die bestehende `Prose`
  nutzt `prose-neutral` (hell) und wäre auf dem dunklen Layout unlesbar — es wird
  eine **`prose-invert`-Variante** für den Blog gebaut.

**Neue Abhängigkeiten:** `next-mdx-remote` (o.ä.), `gray-matter`,
`rehype-pretty-code`/`shiki`.

### Komponenten

Neu:
- **`BlogList`** — Serien-Übersicht: Artikel als `GlassCard`, sortiert nach
  `part`, mit Teil-Nummer, Titel, Summary, Lesezeit, Tags. Kurzer Hero oben.
- **`ArticleHeader`** — Titel, Teil-Badge („Teil 3 / 7"), Datum, Lesezeit, Tags.
- **`SeriesNav`** — am Artikelende „← Teil 2 · Teil 4 →" + „Zur Übersicht".
- **`Callout`** (MDX-Komponente) — Hinweis-/Warn-/Tipp-Boxen im Fließtext.
- **Code-Block** — dunkel, mit Sprach-Label und Copy-Button.

Wiederverwendet: `PageShell`/Layout, `GlassCard`, `Background`, `BrandHeader`,
Footer, Tailwind-Tokens (`softbrew-black/blue/mid`, Akzentfarben).

**Serien-Akzentfarbe:** `softbrew-blue` (freigegeben), damit die Serie visuell
als „eine Sache" erkennbar ist.

## Die 7 Artikel

Jeder Artikel ist erzählend mit konkreten How-To-Blöcken. Die technischen Fakten
stammen aus den realen Repos (`agent-daemon`, `remote-comfyui-ops`,
`agent_cockpit`) und werden vor Veröffentlichung gegen den Code geprüft.

1. **Warum ein eigener Server**
   Datenhoheit, Budget-Kontrolle (Kosten pro Run aus `config/pricing.yaml`),
   Strom sparen (die 3090-Box läuft nicht durch), „kein Chef-Agent überwacht —
   der Daemon macht's deterministisch". Ehrliche Note: Ironie, dass der Blog
   selbst auf Vercel liegt.

2. **Der NUC als Fundament**
   `hostnamectl set-hostname nuc`, `/etc/hosts`, die always-on-Relay-Rolle,
   systemd-Units (`agent-daemon.service` auf `127.0.0.1:7430`), das
   `wakegpu`-Binary unter `/usr/local/bin/`.
   *Offen:* Hardware-Modell (Kontext sagt NUC5i5RYB) steht in keinem Repo — vor
   Veröffentlichung separat verifizieren.

3. **Tailscale**
   `tailscale up --hostname=nuc`, `tailscale set --operator=uli`, MagicDNS
   (`nuc`/`pc`/`laptop`), SSH-Aliase, Taildrop, Loopback + `tailscale serve`
   statt offener Ports. *Hinweis:* keine Tailscale-ACL-Datei vorhanden — nur
   erwähnen, nicht erfinden.

4. **Claude headless auf dem NUC**
   `claude --bg --name <run> --permission-mode <mode> <prompt>`, Job-State unter
   `~/.claude/jobs/<id>/state.json`, Live-Token aus dem Transcript-JSONL,
   Budget-/Scope-Kontrolle, der `cache_read`-Budget-Bug als Lehrstück (40k-Budget
   lief auf 199.799 Tokens, Fix in Iteration 2).

5. **Claude-Agenten & Cockpit**
   Event-Log als Single Source of Truth (`events.py`/`projection.py`/
   `triage.py`), FastAPI-Routen (`/runs`, `/spawn`, `/events`, Action-Routen
   `merge`/`discard`/`redispatch`/`gc`/`respond`), `agent-tui` (Textual,
   Keybindings m/d/r/g/a/q), Worktree-Isolation, die zwei Cockpits (Textual-TUI
   mit Aktionen + Flutter-Reader read-only).

6. **ComfyUI von Claude gesteuert**
   `/gpu-run` (Batch, self-suspending) vs. `/comfy` (konversationell, HTTP),
   ComfyUI-API (`POST /prompt`, `GET /history/<id>`, `GET /view`,
   `GET /object_info`), Workflow-JSONs (`sdxl_api.json`, `ltxv_api.json` …),
   Ablauf Wake→Job→Taildrop→Self-Suspend, der `nvidia_uvm`-überlebt-keinen-
   S3-Suspend-Bug samt Fix (`nvidia-uvm-reload.service`).

7. **Von Laptop & Handy fernsteuern**
   Wake über NUC-Relay (`ssh nuc wakegpu` — Magic-Packets überqueren kein
   Mobilfunk, daher der Relay), Taildrop-Drain-Timer (`taildrop-drain.timer`,
   `OnUnitActiveSec=2min`), Monitoring als „weiterer Leser", TUI über SSH in
   `tmux` (`ssh -t uli@nuc "~/agent-daemon/bin/agent-cockpit"`).

## Genauigkeits-Leitplanken

- Code ist maßgeblich, nicht veraltete Docs: `agent-daemon/API.md` (2026-06-29)
  ist an mehreren Stellen stale (behauptet fehlende Action-Routen / `since_seq`,
  beides existiert inzwischen im Code).
- Nichts erfinden, wo Belege fehlen: keine Tailscale-ACLs, Hardware-Modell
  ungeprüft.
- `hardware-copilot` gehört **nicht** zur Infra-Story (separates Produkt) — nur
  optional als „darauf aufgebaute App" erwähnbar.

## Nicht im Scope (YAGNI)

- Browser-/Handy-Editor zum Schreiben neuer Artikel (Dateien + git genügen;
  später nachrüstbar).
- Umbau der bestehenden Supabase-Devlog-Engine.
- Kommentare, RSS, Newsletter (können später als eigene kleine Vorhaben kommen).

## Umsetzungsreihenfolge (grob)

1. Abhängigkeiten + MDX-Pipeline (`src/lib/blog.ts`, Rendering).
2. Routen `/blog` und `/blog/[slug]` + statische Generierung.
3. Komponenten (`BlogList`, `ArticleHeader`, `SeriesNav`, `Callout`, Code-Block,
   `prose-invert`).
4. Navigations-Link „Blog".
5. Die 7 `.mdx`-Artikel als vollständige Entwürfe.
6. Verifikation: Build (`next build`), Seite lokal ansehen, Fakten gegen Repos
   prüfen.
