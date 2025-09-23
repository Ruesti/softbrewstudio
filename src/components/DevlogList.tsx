// src/components/DevlogList.tsx
type DevlogItem = {
  date: string;        // "YYYY-MM-DD"
  title: string;
  summary: string;
  tags?: string[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function DevlogList({ items }: { items: DevlogItem[] }) {
  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <ul className="space-y-3">
      {sorted.map((e, i) => (
        <li key={i} className="rounded-lg bg-white/90 text-softbrew-black p-4 shadow-sm">
          <div className="text-sm text-softbrew-mid mb-1">
            {formatDate(e.date)}
            {e.tags?.length ? " · " + e.tags.join(" · ") : ""}
          </div>
          <div className="font-medium">{e.title}</div>
          <p className="text-sm mt-1">{e.summary}</p>
        </li>
      ))}
    </ul>
  );
}

