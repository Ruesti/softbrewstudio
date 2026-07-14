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
