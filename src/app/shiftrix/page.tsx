export const metadata = { title: "Shiftrix – Softbrew Studio" };

export default function Page() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <h1>🛠 Shiftrix – Schichtplanung ohne Frust</h1>
      <p>
        Baukastenprinzip: Admin wählt Module, Worker nutzen Mobile/PWA.
        Schichten, Projekte, Chat – so viel wie nötig, so wenig wie möglich.
      </p>
      <hr/>
      <h2>🚀 Features</h2>
      <ul>
        <li>Rollen &amp; Rechte, Schichtplan, Projektstatus</li>
        <li>Mobile App + PWA, Realtime-Updates</li>
        <li>(bald) Push, Chat, Dokumente</li>
      </ul>
      <hr/>
      <h2>📌 Status</h2>
      <p>MVP steht – Beta bald. Updates: <a href="https://linktr.ee/softbrewstudio">linktr.ee/softbrewstudio</a></p>
    </article>
  );
}
