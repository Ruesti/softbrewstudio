// src/data/devlogs.ts
export type Link = { label: string; href: string };
export type Devlog = {
  date: string;      // ISO z.B. "2025-09-22"
  title: string;
  summary: string;
  links?: Link[];
  tags?: string[];
};

export const devlogsFocuspilot: Devlog[] = [
  {
    date: "2025-09-22",
    title: "Card-Layout & Akzent-Sections",
    summary:
      "PageShell vereinheitlicht, Card-Komponenten mit Header/Body/Footer. Farbige Akzent-Sections + neutrale Cards.",
    tags: ["UI", "Design", "DX"],
  },
];

export const devlogsShiftrix: Devlog[] = [
  {
    date: "2025-09-22",
    title: "Grundgerüst erstellt",
    summary:
      "Shiftrix-Updates-Seite angelegt. Erste Akzent-Sections und neutrale Cards.",
    tags: ["Setup"],
  },
];

export const devlogsLinguAI: Devlog[] = [
  {
    date: "2025-09-22",
    title: "Updates-Seite gestartet",
    summary: "Grundstruktur für LinguAI-Devlogs, Farbthema grün.",
    tags: ["Setup"],
  },
];

