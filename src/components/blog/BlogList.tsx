import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import type { BlogMeta } from "@/lib/blog";

export default function BlogList({ posts }: { posts: BlogMeta[] }) {
  return (
    <div className="grid gap-5">
      {posts.map((p) => (
        <Link key={p.slug} href={`/blog/${p.slug}`} className="block">
          <GlassCard accent="neutral" animated={false} className="p-0">
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
