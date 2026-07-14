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
