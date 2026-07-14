# KI-Server-Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a file-based MDX blog under `/blog` to the existing Next.js app, publishing a 7-part technical series about the self-hosted NUC/Tailscale/Claude/ComfyUI setup.

**Architecture:** New statically-rendered `/blog` (list) and `/blog/[slug]` (article) routes read `.mdx` files from `src/content/blog/`. A pure `src/lib/blog.ts` module parses frontmatter (`gray-matter`) and sorts by `part`. Articles render via `next-mdx-remote/rsc` (`compileMDX`) with `rehype-pretty-code`/Shiki for code highlighting and a small custom component map (`Callout`). Prose uses a dark `prose-invert` variant enabled by adding `@tailwindcss/typography`. No Supabase, no runtime data source.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, Tailwind 3, TypeScript, `next-mdx-remote`, `gray-matter`, `rehype-pretty-code`, `shiki`, `@tailwindcss/typography`. Tests via Node's built-in `node:test` runner (no new test dependency).

## Global Constraints

- Next.js 16 App Router, React 19 — Server Components by default; no `"use client"` unless a component needs interactivity (only the code-block copy button does).
- Existing design tokens are authoritative: `softbrew-black #111827`, `softbrew-blue #0EA5E9`, `softbrew-mid #9CA3AF` (`tailwind.config.js`). Series accent = `softbrew-blue`.
- Reuse existing layout/components: `layout.tsx`, `Background`, `BrandHeader`, `GlassCard`, footer. Do NOT modify the Supabase devlog/notes code paths.
- All prose in German; code identifiers as in the repos. Technical facts come from the researched repos and MUST match the code (see "Fact payload" per article in Task 8). Code beats stale docs: `agent-daemon/API.md` is out of date on action routes / `since_seq`.
- Static only: every route uses `generateStaticParams` / no `revalidate` dependency on external services.
- Package manager: npm (repo has `package-lock.json`). If a peer-dependency conflict blocks install under React 19, retry with `npm install --legacy-peer-deps` and note it in the commit.
- Node's built-in test runner: run tests with `node --test`. Test files end in `.test.mjs` and import compiled/pure TS-free logic, OR use `tsx` if TS is needed — prefer keeping the tested module's pure helpers importable without a build (see Task 2).

---

### Task 1: Dependencies + Tailwind typography

**Files:**
- Modify: `package.json` (dependencies)
- Modify: `tailwind.config.js`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: installed packages `next-mdx-remote`, `gray-matter`, `rehype-pretty-code`, `shiki`, `@tailwindcss/typography`; Tailwind `prose` classes available.

- [ ] **Step 1: Install runtime + build dependencies**

Run:
```bash
cd /home/uli/projects/softbrewstudio/.claude/worktrees/blog-ki-server
npm install next-mdx-remote gray-matter rehype-pretty-code shiki
npm install -D @tailwindcss/typography
```
Expected: packages added to `package.json`, `node_modules` populated. If it errors on peer deps, re-run the first command with `--legacy-peer-deps`.

- [ ] **Step 2: Enable the typography plugin in Tailwind**

Modify `tailwind.config.js` — change the plugins line:
```js
  plugins: [require("@tailwindcss/typography")],
```

- [ ] **Step 3: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds (no route changes yet). If build was already broken pre-change, note it and continue.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tailwind.config.js
git commit -m "chore: add MDX + typography dependencies for blog"
```

---

### Task 2: `blog.ts` content library (pure logic + tests)

**Files:**
- Create: `src/lib/blog.ts`
- Create: `src/content/blog/.gitkeep` (empty, so the dir exists)
- Create: `src/lib/blog.frontmatter.test.mjs`

**Interfaces:**
- Consumes: `gray-matter`, Node `fs`/`path`.
- Produces:
  - `type BlogMeta = { title: string; part: number; slug: string; summary: string; date: string; readingTime: string; tags: string[]; cover?: string }`
  - `parseFrontmatter(raw: string): { meta: BlogMeta; content: string }` — pure, no fs.
  - `sortByPart(metas: BlogMeta[]): BlogMeta[]` — pure, ascending by `part`.
  - `getAllPosts(): { meta: BlogMeta; content: string }[]` — reads `src/content/blog/*.mdx`, sorted by part.
  - `getPostBySlug(slug: string): { meta: BlogMeta; content: string } | null`.
  - `getAdjacent(slug: string): { prev: BlogMeta | null; next: BlogMeta | null }`.

- [ ] **Step 1: Write the failing test for pure helpers**

Create `src/lib/blog.frontmatter.test.mjs`:
```js
import test from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter, sortByPart } from "./blog.pure.mjs";

test("parseFrontmatter extracts typed meta and body", () => {
  const raw = `---\ntitle: "Teil 1"\npart: 1\nslug: "warum"\nsummary: "s"\ndate: "2026-07-13"\nreadingTime: "6 min"\ntags: ["a","b"]\n---\nHallo Welt`;
  const { meta, content } = parseFrontmatter(raw);
  assert.equal(meta.part, 1);
  assert.equal(meta.slug, "warum");
  assert.deepEqual(meta.tags, ["a", "b"]);
  assert.match(content, /Hallo Welt/);
});

test("sortByPart orders ascending", () => {
  const out = sortByPart([{ part: 3 }, { part: 1 }, { part: 2 }]);
  assert.deepEqual(out.map((m) => m.part), [1, 2, 3]);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test src/lib/blog.frontmatter.test.mjs`
Expected: FAIL — cannot find `./blog.pure.mjs`.

- [ ] **Step 3: Implement the pure helpers**

Create `src/lib/blog.pure.mjs` (framework-free, importable by both the test and `blog.ts`):
```js
import matter from "gray-matter";

export function parseFrontmatter(raw) {
  const { data, content } = matter(raw);
  const meta = {
    title: String(data.title),
    part: Number(data.part),
    slug: String(data.slug),
    summary: String(data.summary ?? ""),
    date: String(data.date ?? ""),
    readingTime: String(data.readingTime ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
  };
  return { meta, content };
}

export function sortByPart(metas) {
  return [...metas].sort((a, b) => a.part - b.part);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test src/lib/blog.frontmatter.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 5: Implement the fs-backed `blog.ts` on top of the pure helpers**

Create `src/lib/blog.ts`:
```ts
import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, sortByPart } from "./blog.pure.mjs";

export type BlogMeta = {
  title: string;
  part: number;
  slug: string;
  summary: string;
  date: string;
  readingTime: string;
  tags: string[];
  cover?: string;
};

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

function readAll(): { meta: BlogMeta; content: string }[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf8");
    return parseFrontmatter(raw) as { meta: BlogMeta; content: string };
  });
}

export function getAllPosts() {
  const posts = readAll();
  const order = sortByPart(posts.map((p) => p.meta)).map((m) => m.slug);
  return [...posts].sort((a, b) => order.indexOf(a.meta.slug) - order.indexOf(b.meta.slug));
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((p) => p.meta.slug === slug) ?? null;
}

export function getAdjacent(slug: string): { prev: BlogMeta | null; next: BlogMeta | null } {
  const all = getAllPosts();
  const i = all.findIndex((p) => p.meta.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? all[i - 1].meta : null,
    next: i < all.length - 1 ? all[i + 1].meta : null,
  };
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/blog.ts src/lib/blog.pure.mjs src/lib/blog.frontmatter.test.mjs src/content/blog/.gitkeep
git commit -m "feat: add blog content library with frontmatter parsing"
```

---

### Task 3: Blog UI primitives (prose, Callout, code block)

**Files:**
- Create: `src/components/blog/BlogProse.tsx`
- Create: `src/components/blog/Callout.tsx`
- Create: `src/components/blog/CopyButton.tsx`
- Modify: `src/app/globals.css` (append code-block + prose-invert tweaks)

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces:
  - `BlogProse({ children })` — wraps article body in `prose prose-invert` dark styling.
  - `Callout({ type, children })` where `type: "info" | "warn" | "tip"`.
  - `CopyButton({ text })` — a client component copying `text` to clipboard.
  - MDX component map will be assembled in Task 5.

- [ ] **Step 1: Create the dark prose wrapper**

Create `src/components/blog/BlogProse.tsx`:
```tsx
export default function BlogProse({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-invert max-w-none
      prose-headings:tracking-tight
      prose-h2:mt-10 prose-h2:mb-4
      prose-p:leading-relaxed prose-p:text-white/85
      prose-a:text-softbrew-blue hover:prose-a:underline
      prose-strong:text-white
      prose-code:text-softbrew-blue prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create the Callout component**

Create `src/components/blog/Callout.tsx`:
```tsx
const STYLES: Record<string, string> = {
  info: "border-softbrew-blue/50 bg-softbrew-blue/10",
  warn: "border-amber-400/50 bg-amber-400/10",
  tip: "border-emerald-400/50 bg-emerald-400/10",
};
const ICON: Record<string, string> = { info: "ℹ️", warn: "⚠️", tip: "💡" };

export default function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warn" | "tip";
  children: React.ReactNode;
}) {
  return (
    <div className={`my-6 rounded-brand border px-4 py-3 text-white/90 ${STYLES[type]}`}>
      <span className="mr-2">{ICON[type]}</span>
      <span className="[&>p]:inline">{children}</span>
    </div>
  );
}
```

- [ ] **Step 3: Create the copy button (client component)**

Create `src/components/blog/CopyButton.tsx`:
```tsx
"use client";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="absolute right-2 top-2 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
      aria-label="Code kopieren"
    >
      {copied ? "kopiert" : "kopieren"}
    </button>
  );
}
```

- [ ] **Step 4: Append code-block styling to globals.css**

Append to `src/app/globals.css`:
```css
/* Blog code blocks (rehype-pretty-code / Shiki) */
[data-rehype-pretty-code-figure] { position: relative; }
[data-rehype-pretty-code-figure] pre { overflow-x: auto; border-radius: 0.75rem; padding: 1rem; }
[data-rehype-pretty-code-figure] code { display: grid; font-size: 0.85rem; }
[data-rehype-pretty-code-title] {
  font-size: 0.75rem; color: #9CA3AF; padding: 0.25rem 0.5rem;
  border: 1px solid rgba(255,255,255,0.1); border-bottom: none;
  border-radius: 0.5rem 0.5rem 0 0; background: rgba(0,0,0,0.4);
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: build succeeds (components unused so far, but must compile).

- [ ] **Step 6: Commit**

```bash
git add src/components/blog/ src/app/globals.css
git commit -m "feat: add blog UI primitives (prose, callout, copy button)"
```

---

### Task 4: `/blog` list route + BlogList

**Files:**
- Create: `src/components/blog/BlogList.tsx`
- Create: `src/app/blog/page.tsx`

**Interfaces:**
- Consumes: `getAllPosts()` (Task 2), `GlassCard` (existing), `BlogMeta` (Task 2).
- Produces: server-rendered `/blog` overview; `BlogList({ posts })` where `posts: BlogMeta[]`.

- [ ] **Step 1: Create BlogList**

Create `src/components/blog/BlogList.tsx`:
```tsx
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import type { BlogMeta } from "@/lib/blog";

export default function BlogList({ posts }: { posts: BlogMeta[] }) {
  return (
    <div className="grid gap-5">
      {posts.map((p) => (
        <Link key={p.slug} href={`/blog/${p.slug}`} className="block">
          <GlassCard accent="focuspilot" animated={false} className="p-0">
            <div className="p-5">
              <div className="text-xs font-semibold text-softbrew-blue">
                Teil {p.part} / {posts.length}
              </div>
              <h2 className="mt-1 text-xl font-semibold text-white">{p.title}</h2>
              {p.summary && <p className="mt-2 text-white/70">{p.summary}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-softbrew-mid">
                <span>{p.date}</span>
                <span>·</span>
                <span>{p.readingTime}</span>
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/15 px-2 py-0.5">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create the `/blog` page**

Create `src/app/blog/page.tsx`:
```tsx
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogList from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Mein eigener KI-Server – Blog | Softbrew Studio",
  description:
    "Eine 7-teilige Serie: eigener NUC-Server, Tailscale, Claude headless, Agenten-Cockpit und ComfyUI von überall ferngesteuert.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts().map((p) => p.meta);
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-softbrew-blue">
          Serie
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Mein eigener KI-Server
        </h1>
        <p className="mt-3 text-lg text-white/70">
          Wie aus einem kleinen NUC, Tailscale und Claude ein privates,
          fernsteuerbares KI-Labor wurde – in sieben Teilen, mit allen Befehlen
          zum Nachbauen.
        </p>
      </header>
      <BlogList posts={posts} />
    </div>
  );
}
```

- [ ] **Step 3: Verify build + route (temporary check)**

Run: `npm run build`
Expected: build succeeds; `/blog` appears in the route list (empty list is fine — no articles yet). If build lists `/blog` as a static route, pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/page.tsx src/components/blog/BlogList.tsx
git commit -m "feat: add /blog series overview page"
```

---

### Task 5: `/blog/[slug]` article route + header + series nav + MDX render

**Files:**
- Create: `src/components/blog/ArticleHeader.tsx`
- Create: `src/components/blog/SeriesNav.tsx`
- Create: `src/components/blog/mdxComponents.tsx`
- Create: `src/app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllPosts`, `getPostBySlug`, `getAdjacent`, `BlogMeta` (Task 2); `BlogProse`, `Callout`, `CopyButton` (Task 3); `compileMDX` from `next-mdx-remote/rsc`; `rehype-pretty-code`.
- Produces: statically generated article pages at `/blog/[slug]`.

- [ ] **Step 1: Create ArticleHeader**

Create `src/components/blog/ArticleHeader.tsx`:
```tsx
import type { BlogMeta } from "@/lib/blog";

export default function ArticleHeader({ meta, total }: { meta: BlogMeta; total: number }) {
  return (
    <header className="mb-8 border-b border-white/10 pb-6">
      <div className="text-xs font-semibold text-softbrew-blue">
        Teil {meta.part} / {total}
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {meta.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-softbrew-mid">
        <span>{meta.date}</span>
        <span>·</span>
        <span>{meta.readingTime}</span>
        {meta.tags.map((t) => (
          <span key={t} className="rounded-full border border-white/15 px-2 py-0.5 text-xs">
            #{t}
          </span>
        ))}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create SeriesNav**

Create `src/components/blog/SeriesNav.tsx`:
```tsx
import Link from "next/link";
import type { BlogMeta } from "@/lib/blog";

export default function SeriesNav({ prev, next }: { prev: BlogMeta | null; next: BlogMeta | null }) {
  return (
    <nav className="mt-12 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
      <div>
        {prev && (
          <Link href={`/blog/${prev.slug}`} className="block text-white/80 hover:text-white">
            <div className="text-xs text-softbrew-mid">← Teil {prev.part}</div>
            <div className="font-medium">{prev.title}</div>
          </Link>
        )}
      </div>
      <div className="sm:text-right">
        {next && (
          <Link href={`/blog/${next.slug}`} className="block text-white/80 hover:text-white">
            <div className="text-xs text-softbrew-mid">Teil {next.part} →</div>
            <div className="font-medium">{next.title}</div>
          </Link>
        )}
      </div>
      <div className="sm:col-span-2 sm:text-center">
        <Link href="/blog" className="text-sm text-softbrew-blue hover:underline">
          Zur Serienübersicht
        </Link>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create the MDX component map**

Create `src/components/blog/mdxComponents.tsx`:
```tsx
import Callout from "./Callout";

export const mdxComponents = {
  Callout,
};
```

- [ ] **Step 4: Create the article page with static generation + Shiki highlighting**

Create `src/app/blog/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPostBySlug, getAdjacent } from "@/lib/blog";
import BlogProse from "@/components/blog/BlogProse";
import ArticleHeader from "@/components/blog/ArticleHeader";
import SeriesNav from "@/components/blog/SeriesNav";
import { mdxComponents } from "@/components/blog/mdxComponents";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.meta.title} | Softbrew Studio`, description: post.meta.summary };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const total = getAllPosts().length;
  const { prev, next } = getAdjacent(slug);

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
      },
    },
  });

  return (
    <article className="mx-auto max-w-3xl">
      <ArticleHeader meta={post.meta} total={total} />
      <BlogProse>{content}</BlogProse>
      <SeriesNav prev={prev} next={next} />
    </article>
  );
}
```

- [ ] **Step 5: Add a temporary smoke article and verify build**

Create `src/content/blog/_smoke.mdx`:
```mdx
---
title: "Smoke"
part: 99
slug: "smoke"
summary: "temp"
date: "2026-07-13"
readingTime: "1 min"
tags: ["temp"]
---

## Test

Ein `inline` code und ein Block:

```bash
echo hallo
```

<Callout type="warn">Achtung, nur ein Test.</Callout>
```

Run: `npm run build`
Expected: build succeeds; `/blog/smoke` is generated as a static page; code block is highlighted (no MDX/compile errors).

- [ ] **Step 6: Remove the smoke article**

Run: `rm src/content/blog/_smoke.mdx`

- [ ] **Step 7: Commit**

```bash
git add src/app/blog src/components/blog/ArticleHeader.tsx src/components/blog/SeriesNav.tsx src/components/blog/mdxComponents.tsx
git commit -m "feat: add /blog/[slug] article route with MDX + code highlighting"
```

---

### Task 6: Navigation link to the blog

**Files:**
- Modify: `src/components/BrandHeader.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: a visible "Blog" link in the site header.

- [ ] **Step 1: Read the current header to match its pattern**

Run: `cat src/components/BrandHeader.tsx`
Expected: understand how existing nav links are rendered (Link vs anchor, classes).

- [ ] **Step 2: Add a "Blog" link following the existing pattern**

Modify `src/components/BrandHeader.tsx` — add, alongside the existing nav items, using the SAME element/class style already present there:
```tsx
<Link href="/blog" className="hover:text-white">Blog</Link>
```
(Match the exact classes/structure of the neighboring links; if the header maps an array of links, add `{ href: "/blog", label: "Blog" }` to that array instead.)

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds; header compiles.

- [ ] **Step 4: Commit**

```bash
git add src/components/BrandHeader.tsx
git commit -m "feat: add Blog link to site header"
```

---

### Task 7: Verify the empty pipeline end-to-end

**Files:** none (verification task).

**Interfaces:**
- Consumes: everything from Tasks 1–6.
- Produces: confidence that routes render before content is written.

- [ ] **Step 1: Run the unit tests**

Run: `node --test src/lib/blog.frontmatter.test.mjs`
Expected: PASS.

- [ ] **Step 2: Start dev server and view /blog**

Run: `npm run dev` (background), then load `http://localhost:3000/blog`.
Expected: overview page renders with the dark theme, hero visible, empty (or smoke-free) list. Stop the dev server.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds; `/blog` present; no `/blog/[slug]` params yet (no articles) — that is fine.

---

### Task 8: Write the 7 articles

Each article is a full German draft with concrete how-to blocks. Facts below are the **required payload** for each article — taken from the real repos; the writer weaves them into narrative prose. Verify each fact against the code before finalizing (code beats stale `API.md`). Use `<Callout type="warn|tip|info">` for the flagged gotchas. Each code block should use a fenced language and, where useful, a `title` (rehype-pretty-code supports ```` ```bash title="…" ````).

**Files (create all):**
- `src/content/blog/01-warum-eigener-server.mdx` (slug `warum-eigener-server`, part 1)
- `src/content/blog/02-nuc-fundament.mdx` (slug `nuc-fundament`, part 2)
- `src/content/blog/03-tailscale.mdx` (slug `tailscale-privates-netz`, part 3)
- `src/content/blog/04-claude-headless.mdx` (slug `claude-headless-nuc`, part 4)
- `src/content/blog/05-agenten-cockpit.mdx` (slug `claude-agenten-cockpit`, part 5)
- `src/content/blog/06-comfyui-von-claude.mdx` (slug `comfyui-von-claude`, part 6)
- `src/content/blog/07-fernsteuern.mdx` (slug `fernsteuern-laptop-handy`, part 7)

Every file starts with valid frontmatter (`title, part, slug, summary, date, readingTime, tags`).

- [ ] **Step 1: Article 1 — Warum ein eigener Server**
Payload: Datenhoheit; Budget-Kontrolle mit echten Kostenzahlen aus `agent-daemon/config/pricing.yaml` (per-model USD pro 1M Tokens; `default_model: claude-sonnet-4-6`); Kosten pro Run live aus Transcript-Usage (`daemon/watcher.py:_cost_from_usage`); Netz-Posture „Daemon nur `127.0.0.1` / Tailscale, nie `0.0.0.0`"; Strom sparen: die 3090-Box läuft nicht durch, wird on-demand geweckt und suspendet selbst (`remote-comfyui-ops/SPEC_remote_comfyui.md` §1); „kein Chef-Agent überwacht — der Daemon macht's deterministisch". Ehrliche `<Callout type="info">`: dieser Blog läuft bewusst auf Vercel, nicht auf dem NUC — warum (öffentliche Erreichbarkeit unabhängig vom Spielserver).
Then run `npm run build`, confirm `/blog/warum-eigener-server` generates. Commit: `git add src/content/blog/01-warum-eigener-server.mdx && git commit -m "content: article 1 – warum ein eigener Server"`.

- [ ] **Step 2: Article 2 — Der NUC als Fundament**
Payload: `sudo hostnamectl set-hostname nuc`; `/etc/hosts`-Umschrieb (`sudo sed -i 's/uli\.nuc uli/nuc.nuc nuc/' /etc/hosts`); NUC als always-on-Relay im LAN neben der GPU-Box, macht selbst nie GPU-Arbeit; systemd-Service `agent-daemon.service` (`ExecStart=…/.venv/bin/uvicorn daemon.main:app --host 127.0.0.1 --port 7430`, `Restart=always`, `User=uli`), installiert via `sudo cp … /etc/systemd/system/ && sudo systemctl enable --now agent-daemon`; das `wakegpu`-Binary unter `/usr/local/bin/wakegpu` (`install -m 0755`). `<Callout type="warn">`: in automatisierten Sessions kein `sudo` verfügbar — privilegierte Schritte macht der Mensch. `<Callout type="info">`: Hardware-Modell (NUC5i5RYB) VOR Veröffentlichung separat verifizieren — steht in keinem Repo; nur schreiben, wenn bestätigt.
Then `npm run build`; commit `content: article 2 – der NUC als Fundament`.

- [ ] **Step 3: Article 3 — Tailscale**
Payload: `sudo tailscale up --hostname=nuc`; `sudo tailscale set --operator=uli` (nötig, damit `tailscale file get/cp` ohne root läuft); MagicDNS-Namen `nuc` (100.97.223.43), `pc` (100.110.170.56), `laptop`; SSH-Alias in `~/.ssh/config` (`Host gpu-box` → `HostName pc`, `User uli`, `IdentityFile ~/.ssh/id_ed25519`); Taildrop als Datei-Transfer; Daemon bindet Loopback, Zugriff über Tailscale per SSH-Tunnel (`ssh -L 7430:127.0.0.1:7430 nuc`) ODER `ssh uli@nuc 'tailscale serve --bg --http=7430 127.0.0.1:7430'`. `<Callout type="info">`: keine Tailscale-ACL-Datei im Setup — ehrlich erwähnen, nichts erfinden.
Then `npm run build`; commit `content: article 3 – tailscale`.

- [ ] **Step 4: Article 4 — Claude headless auf dem NUC**
Payload: Spawn-argv `claude --bg --name <run_id> --permission-mode <mode> <prompt>` (`daemon/spawn.py`; `permission_mode` aus `config/pricing.yaml → watcher.permission_mode: auto`); reales Beispiel aus der Praxis: `claude --bg --name verbrauch --permission-mode acceptEdits "…"`; Job-id-Parsing (8-hex aus stdout `backgrounded … ([0-9a-f]{8})`); Lifecycle via CLI (`claude agents --json --all`, `claude stop <job_id>`, `claude rm <job_id>`, `claude attach <job_id>`); State unter `~/.claude/jobs/<id>/state.json`, aber Live-Token NICHT dort — aus Transcript `~/.claude/projects/<slug>/<sessionId>.jsonl` inkrementell gelesen (`watcher.py:_process_transcript`). `<Callout type="warn">` Lehrstück: Budget-Metrik summierte anfangs `input+output+cache_write+cache_read`; weil `cache_read` jede Runde den ganzen Kontext (100k+) neu zählt, lief ein 40k-Budget auf 199.799 Tokens; Fix in Iteration 2 (`_budget_tokens` ohne `cache_read`, Kosten behalten ihn). `claude stop` bei `budget_exceeded` funktioniert (`watcher.py`).
Then `npm run build`; commit `content: article 4 – claude headless`.

- [ ] **Step 5: Article 5 — Claude-Agenten & Cockpit**
Payload: Append-only Event-Log = Single Source of Truth (`daemon/events.py` Log, `projection.py` Fold, `triage.py` „nur was dich braucht", `model.py` Run/Balance); FastAPI auf `127.0.0.1:7430` (`daemon/main.py`), Routen `GET /healthz /runs /runs/{id} /repos`, `POST /spawn`, `GET/POST /events`; Action-Routen EXISTIEREN (`daemon/routes/runs.py`): `POST /runs/{id}/merge|discard|redispatch|gc|respond` (jede emittiert `*_requested`-Event, ruft `watcher.handle_*`); Events via `GET /events?since=<ts>` oder `?since_seq=<int>`, KEIN SSE (Clients pollen 1–2 s); Worktree-Isolation (`git worktree add -b agent/<slug> .worktrees/<branch> <base>`, slugify + Kollisions-Suffix, `_validate_ref_name`); Registry `config/registry.yaml`. TUI: `agent-tui = "tui.app:main"` (`pip install -e . && agent-tui`), Launcher `bin/agent-cockpit`, remote via `ssh -t uli@nuc "~/agent-daemon/bin/agent-cockpit"`, in `tmux attach -t agent-tui`; `tui/poller.py` pollt `GET /runs` alle 2 s; Keybindings `m` merge, `d` discard, `r` redispatch, `g` gc, `a` all, `q` quit. Zwei Cockpits: Textual-TUI (Aktionen live) und Flutter `agent_cockpit` („reiner Leser, kein eigener Zustand", pollt `GET /events` alle 1500 ms, `http_actuation_channel.dart` wirft `UnimplementedError` → read-only). `<Callout type="tip">` Code schlägt Docs: `API.md` (2026-06-29) behauptet fehlende Action-Routen/`since_seq` — beides existiert im Code.
Then `npm run build`; commit `content: article 5 – agenten & cockpit`.

- [ ] **Step 6: Article 6 — ComfyUI von Claude gesteuert**
Payload: ComfyUI läuft auf `pc` (RTX 3090), Install `~/ComfyUI-Easy-Install/.../ComfyUI`, systemd `gpu-box/comfyui.service` (`main.py --listen 0.0.0.0`), API `http://pc:8188` über Tailscale; zwei Wege, beide als Claude-Slash-Commands (`~/.claude/commands/`): `/gpu-run` (Batch, self-suspending → `~/gpu-run.sh <workflow>`) vs. `/comfy` (konversationell, HTTP → `~/comfy-api.sh`); ComfyUI-API: `GET /system_stats` (readiness), `POST /prompt` body `{prompt:<workflow>, client_id:"claude-code"}` → `prompt_id` (+`node_errors`), `GET /history/<prompt_id>` (`.status.completed`), `GET /view?filename=…&subfolder=…&type=output`, `GET /object_info[/Node]`; Workflow-JSONs `sdxl_api.json` (SDXL 1024²), `dreamshaper_api.json` (SD1.5), `ltxv_api.json` (Video), `test_pipeline_api.json` (CPU-Smoke); Prompt-Injektion in Node mit `_meta.title=="PROMPT"` via `jq`; Ablauf Wake→Job→Taildrop→Self-Suspend; Fail-safe: Box suspendet nur (`sudo systemctl suspend`, NOPASSWD-sudoers) wenn Job UND Taildrop ok, sonst bleibt sie an mit Grund im Log. `<Callout type="warn">` `nvidia_uvm` überlebt keinen S3-Suspend — CUDA ist nach Resume tot, obwohl `nvidia-smi`/`/system_stats` gesund melden; Fix `nvidia-uvm-reload.service` beim Resume + frischer `torch.cuda.is_available()`-Vorabcheck in `run-and-sleep.sh`. `<Callout type="info">` Der orchestrierende Agent läuft auf dem NUC, nie auf der GPU-Box (damit er sich beim Auto-Shutdown-Test nicht selbst aussperrt).
Then `npm run build`; commit `content: article 6 – comfyui von claude`.

- [ ] **Step 7: Article 7 — Von Laptop & Handy fernsteuern**
Payload: Wake von überall (auch Mobilfunk) via `ssh nuc wakegpu` — der NUC-Relay sendet das Magic-Packet an `d8:43:ae:61:f4:b8` im LAN (MAC single-sourced in `nuc/wakegpu`); `<Callout type="warn">` WoL-Magic-Packets überqueren keine Subnetze/Mobilfunk — deshalb der Relay-Umweg über den always-on NUC; Ein-Kommando-Ritual `~/gpu-run.sh sdxl_api` bzw. `/gpu-run sdxl_api` in Claude Code; Ergebnisse per Taildrop aufs `laptop`, systemd-User-Timer drainiert die Inbox (`laptop/taildrop-drain.timer`, `OnBootSec=1min`, `OnUnitActiveSec=2min`, `Persistent=true` → `tailscale file get -conflict=rename ~/taildrop-inbox/`), aktivieren mit `systemctl --user enable --now taildrop-drain.timer`; ans Handy senden gleiches Muster (`tailscale file cp … <handy-name>:`); Monitoring von mobil = drei Betriebsarten (lokal / Daemon auf NUC + Cockpit liest über Tailscale / mobil = „nur ein weiterer Leser" mit Snapshot + allem Neuen); Zugriff auf den loopback-gebundenen Daemon per SSH-Tunnel, `tailscale serve`, oder TUI über SSH in `tmux`.
Then `npm run build`; commit `content: article 7 – fernsteuern`.

---

### Task 9: Final verification

**Files:** none.

- [ ] **Step 1: Unit tests pass** — Run: `node --test src/lib/blog.frontmatter.test.mjs` — Expected: PASS.
- [ ] **Step 2: Production build** — Run: `npm run build` — Expected: succeeds; all 7 `/blog/<slug>` pages generated (7 static params), `/blog` present; no MDX compile errors.
- [ ] **Step 3: Visual pass** — Run `npm run dev`, load `/blog` and each of the 7 articles. Confirm: dark theme, code highlighting, callouts, series nav prev/next correct at ends (Teil 1 has no prev, Teil 7 has no next), header "Blog" link works. Stop dev server.
- [ ] **Step 4: Fact audit** — For each article, re-check the flagged uncertain facts: NUC hardware model only stated if independently confirmed; no invented Tailscale ACLs; action-routes/`since_seq` described per code not `API.md`.
- [ ] **Step 5: Final commit if any fixes** — `git add -A && git commit -m "fix: blog verification pass"` (skip if clean).

---

## Notes for the executor

- If `compileMDX` from `next-mdx-remote/rsc` hits a React 19 / Next 16 incompatibility, the fallback is `@mdx-js/mdx` `compile` + `run` (same rehype plugin); keep the component map and `rehype-pretty-code` config identical.
- The `blog.pure.mjs` split exists so the pure parsing/sorting logic is testable with `node --test` without a TS build step or a bundler. Keep fs access out of that file.
- Do not touch `src/lib/supabaseServer.ts`, `src/app/updates/**`, `src/app/notes/**`, `src/app/admin/**`, or the `devlogs` API routes.
