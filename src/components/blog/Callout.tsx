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
