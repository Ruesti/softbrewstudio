export const metadata = { title: "FocusPilot – Softbrew Studio" };

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">✨ FocusPilot – Projekt-CoPilot statt Chaos</h1>
      <p className="text-white/80">
        FocusPilot speichert automatisch Kontext, To-dos und Fortschritt – damit du jederzeit
        nahtlos weitermachst. Mit GPT als ruhigem Co-Piloten.
      </p>
      <hr className="border-white/10" />
      <h2 className="text-2xl font-semibold">🚀 Features</h2>
      <ul className="list-disc pl-6 text-white/80 space-y-1">
        <li>Automatische Projektnotizen (Developer Notes)</li>
        <li>GPT-Wiedereinstieg („Was war zuletzt wichtig?“)</li>
        <li>Aufgaben &amp; Meilensteine ohne Overhead</li>
      </ul>
      <hr className="border-white/10" />
      <h2 className="text-2xl font-semibold">📌 Status</h2>
      <p className="text-white/80">
        Coming Soon – Alpha intern. Updates &amp; Beta:&nbsp;
        <a className="underline" href="https://linktr.ee/softbrewstudio">linktr.ee/softbrewstudio</a>
      </p>
    </article>
  );
}

