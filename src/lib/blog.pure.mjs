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
