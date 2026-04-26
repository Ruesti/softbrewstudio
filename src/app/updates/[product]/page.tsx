type Product = "focuspilot" | "hardware-copilot";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "2-digit" });
}
function excerpt(s: string, n = 260) {
  const t = s.replace(/```[\s\S]*?```/g, "").replace(/`[^`]+`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[#>*_~\-]/g, " ").replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
}

export default async function ProductUpdates({ params }: { params: { product: Product } }) {
  const product = params.product;
  if (!["focuspilot","hardware-copilot"].includes(product)) return null;

  type LogItem = { id: string; created_at: string; title: string; body: string };
  const res = await fetch(`/api/devlogs/recent?project=${product}&limit=30`, { cache: "no-store" });
  const items: LogItem[] = res.ok ? await res.json() : [];

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 space-y-6">
      <h1 className="text-3xl font-semibold capitalize">{product} – Alle Updates</h1>
      <div className="space-y-4">
        {items.length === 0 && <div className="rounded-brand border border-white/10 bg-white/5 p-4 text-white/70">Noch keine Einträge.</div>}
        {items.map((log) => (
          <article key={log.id} className="rounded-brand border border-white/10 bg-white/5 backdrop-blur p-4">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="uppercase tracking-wide">{product}</span>
              <time>{fmtDate(log.created_at)}</time>
            </div>
            <h2 className="mt-1 text-xl font-semibold">{log.title}</h2>
            <p className="mt-2 text-white/70">{excerpt(log.body)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
