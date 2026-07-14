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
