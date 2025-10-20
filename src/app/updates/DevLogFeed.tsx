type DevLog = {
  id: string;
  created_at: string;
  project: "focuspilot" | "shiftrix" | "linguai";
  title: string;
  body: string;
  tags?: string[] | null;
  author?: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function excerpt(text: string, len = 180) {
  const plain = text.replace(/[#>*_`]/g, "").trim();
  return plain.length > len ? plain.slice(0, len - 1) + "…" : plain;
}

export default async function DevLogFeed() {
  const res = await fetch("/api/devlogs/recent", { cache: "no-store" });
  const items = (await res.json()) as DevLog[];

  if (!items.length)
    return (
      <p className="text-white/70 text-sm">
        Noch keine DevLog-Einträge veröffentlicht.
      </p>
    );

  return (
    <div className="space-y-4">
      {items.map((log) => (
        <article
          key={log.id}
          className="rounded-brand border border-white/10 bg-white/5 p-4 backdrop-blur hover:border-white/20 transition"
        >
          <div className="flex items-center justify-between text-xs text-white/60">
            <span className="uppercase tracking-wide">
              {log.project ?? "SoftBrew"}
            </span>
            <time>{formatDate(log.created_at)}</time>
          </div>

          <h3 className="mt-1 text-lg font-semibold">{log.title}</h3>
          <p className="mt-2 text-white/70 text-sm">{excerpt(log.body)}</p>
        </article>
      ))}
    </div>
  );
}
