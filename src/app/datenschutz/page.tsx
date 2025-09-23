export const metadata = { title: "Datenschutz – Softbrew Studio" };

export default function Page() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <h1>Datenschutzerklärung</h1>

      <h2>Verantwortlicher</h2>
      <p>
        Softbrew Studio – Ulrich Wallis<br/>
        {/* Deine Anschrift hier einsetzen */}
        Industriestr.14a, 28857 Syke, Deutschland<br/>
        E-Mail: <a href="mailto:support@softbrewstudio.com">support@softbrewstudio.com</a>
      </p>

      <h2>Hosting</h2>
      <p>
        Diese Website wird bei Vercel (Vercel Inc.) gehostet. Beim Aufruf der Seiten werden technische Daten wie
        IP-Adresse, Zeitpunkt, User-Agent und Referrer zum Betrieb und zur Sicherheit verarbeitet. Rechtsgrundlage
        ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer sicheren Bereitstellung der Website).
      </p>

      <h2>Server-Logfiles</h2>
      <p>
        Der Hoster erhebt und speichert automatisch Informationen in sogenannten Server-Logfiles, die Ihr Browser
        automatisch übermittelt.
      </p>

      <h2>Kontaktaufnahme</h2>
      <p>
        Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben zwecks Bearbeitung der Anfrage sowie für den Fall
        von Anschlussfragen gespeichert (Art. 6 Abs. 1 lit. b/f DSGVO).
      </p>

      <h2>Cookies/Tracking</h2>
      <p>
        Aktuell setzen wir keine Cookies zu Analyse- oder Marketingzwecken ein und verwenden keine externen
        Trackingdienste. Sollte sich dies ändern, wird diese Erklärung aktualisiert.
      </p>

      <h2>Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie auf
        Datenübertragbarkeit. Außerdem besteht ein Beschwerderecht bei einer Aufsichtsbehörde.
      </p>
    </article>
  );
}
