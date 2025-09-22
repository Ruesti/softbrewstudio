export const metadata = { title: "Updates & Devlog – Softbrew Studio" };

const posts = [
  { title: "Devlog #1", body: "Roadmap Shiftrix steht, PWA-Setup begonnen." },
  { title: "Devlog #2", body: "FocusPilot: GPT-Wiedereinstieg getestet." },
  { title: "Devlog #3", body: "LinguAI: erste Charakter-Skizzen." },
];

export default function Page() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">📰 Updates & Devlog</h1>
      <div className="grid gap-4">
        {posts.map((p) => (
          <article key={p.title} className="border border-softbrew.gray/60 rounded-brand p-4">
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="text-softbrew-mid">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
