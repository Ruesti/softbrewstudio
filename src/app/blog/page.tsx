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
