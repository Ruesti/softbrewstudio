export const metadata = { title: "Datenschutz – Pacto – Softbrew Studio" };

export default function Page() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <h1>Datenschutzerklärung — Pacto</h1>
      <p><em>Stand: Juli 2026</em></p>

      <p>
        Diese Datenschutzerklärung informiert dich darüber, welche personenbezogenen Daten bei der
        Nutzung der App <strong>Pacto</strong> verarbeitet werden, zu welchem Zweck und auf welcher
        Rechtsgrundlage. Pacto ist als local-first App konzipiert: Alle Daten werden zunächst
        ausschließlich lokal und verschlüsselt auf deinem Gerät gespeichert. Cloud-Funktionen sind
        optional und werden nur aktiv, wenn du sie ausdrücklich einschaltest.
      </p>

      <h2>Verantwortlicher</h2>
      <p>
        Softbrew Studio – Ulrich Wallis<br/>
        Industriestr. 14a, 28857 Syke, Deutschland<br/>
        E-Mail: <a href="mailto:info@softbrewstudio.com">info@softbrewstudio.com</a>
      </p>

      <h2>Überblick: Welche Daten wo verarbeitet werden</h2>
      <ul>
        <li><strong>Verträge, Abos, Zugänge</strong> (Name, Anbieter, Kosten, Kündigungsfristen, Zugangsdaten) — nur lokal, verschlüsselt (SQLCipher) auf deinem Gerät. Standardmäßig aktiv, da Kernfunktion.</li>
        <li><strong>Cloud-Sync zwischen Geräten</strong> — Supabase (Serverstandort Frankfurt/EU), Inhalte client-seitig AES-256-verschlüsselt. Standardmäßig aus, opt-in.</li>
        <li><strong>KI-gestützte Vertragserkennung</strong> (Foto-/PDF-Scan) — Supabase Edge Function → Anthropic API (USA). Nur bei aktiver Nutzung des Scan-Features.</li>
        <li><strong>Passwort-Leak-Check</strong> — Have I Been Pwned API, nur Hash-Präfix (k-Anonymität). Standardmäßig aus, opt-in.</li>
        <li><strong>Inaktivitäts-Tresor / Erben-Benachrichtigung</strong> — Supabase (verschlüsselt) + Versand über Resend. Standardmäßig aus, opt-in, erfordert Cloud-Sync.</li>
        <li><strong>In-App-Kauf</strong> — Google Play / Apple App Store, Kaufbestätigung über RevenueCat. Nur beim Kauf.</li>
      </ul>

      <h2>Lokale Datenspeicherung (Kernfunktion)</h2>
      <p>
        Alle Verträge, Abonnements, Zugangsdaten und ggf. angehängte Dokumente/Fotos werden in einer
        lokalen, mit SQLCipher verschlüsselten Datenbank auf deinem Gerät gespeichert. Der Schlüssel
        dazu liegt im sicheren Systemspeicher deines Geräts (Android Keystore / iOS Keychain) und
        verlässt das Gerät nicht. Ohne aktivierten Cloud-Sync verlassen diese Daten dein Gerät zu
        keinem Zeitpunkt.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO)
        — die lokale Speicherung ist die Kernfunktion der App.
      </p>

      <h3>App-Sperre</h3>
      <p>
        Optional kannst du eine App-Sperre per PIN und/oder Biometrie (Fingerabdruck/Gesichtserkennung)
        einrichten. Biometrische Daten selbst verlassen dabei nie das Betriebssystem deines Geräts und
        werden von Pacto weder gespeichert noch verarbeitet — die App erhält lediglich das Ergebnis
        &bdquo;erfolgreich/fehlgeschlagen&ldquo; vom Betriebssystem.
      </p>

      <h2>Cloud-Sync zwischen Geräten (optional)</h2>
      <p>
        Wenn du den Cloud-Sync in den Einstellungen aktivierst, wird dein gesamter Datenbestand
        (Verträge, Zugänge, Erben) vor dem Hochladen client-seitig mit AES-256 verschlüsselt und als
        verschlüsseltes Paket an unser Supabase-Projekt (Serverstandort Frankfurt, Deutschland)
        übertragen. Der Entschlüsselungsschlüssel verbleibt ausschließlich auf deinen Geräten und wird
        niemals an Supabase übermittelt — der Anbieter kann die Inhalte nicht einsehen.
      </p>
      <p>
        Zur Zuordnung wird eine zufällig generierte, anonyme Geräte-/Sitzungskennung verwendet, kein
        Name, keine E-Mail-Adresse und keine sonstige direkt identifizierende Angabe.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) durch aktives
        Einschalten der Funktion. Auftragsverarbeiter: Supabase Inc. (Hosting in der EU/Frankfurt), es
        besteht ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.
      </p>

      <h2>KI-gestützte Vertragserkennung (Foto-/PDF-Scan)</h2>
      <p>
        Wenn du ein Foto, einen Screenshot oder ein PDF eines Vertrags über die Scan-Funktion
        importierst, wird die Bilddatei an eine Supabase Edge Function übermittelt, die sie zur
        automatischen Texterkennung an die Anthropic API (Claude Haiku Modell, Anthropic PBC, USA)
        weiterleitet. Anthropic verarbeitet das Bild ausschließlich zur Extraktion der Vertragsdaten
        (Name, Anbieter, Preis, Kündigungsfrist etc.) und gibt ein strukturiertes Ergebnis zurück.
      </p>
      <p>
        Laut den API-Nutzungsbedingungen von Anthropic werden über die API eingereichte Daten nicht
        zum Training von Modellen verwendet und nur für einen begrenzten Zeitraum zur
        Missbrauchserkennung vorgehalten. Details:{" "}
        <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">
          anthropic.com/legal/privacy
        </a>. Da Anthropic PBC in den USA ansässig ist, findet hierbei eine Datenübermittlung in ein
        Drittland statt; Anthropic verwendet hierfür die EU-Standardvertragsklauseln als Garantie für
        ein angemessenes Datenschutzniveau.
      </p>
      <p>
        Zur Missbrauchsvermeidung wird pro anonymer Geräte-Sitzung ein monatliches Scan-Limit
        (100 Scans) serverseitig gezählt.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Einwilligung durch aktive Nutzung des Scan-Features
        (Art. 6 Abs. 1 lit. a DSGVO). Du kannst alle erkannten Felder vor dem Speichern prüfen und
        manuell korrigieren.
      </p>

      <h2>Passwort-Leak-Check (optional)</h2>
      <p>
        Wenn du in den Einstellungen den Leak-Check für hinterlegte Zugangsdaten aktivierst, wird das
        jeweilige Passwort niemals im Klartext übertragen. Stattdessen wird lokal ein SHA-1-Hash
        gebildet und nur die ersten 5 Zeichen dieses Hashes (k-Anonymität) an die{" "}
        <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer">
          Have I Been Pwned
        </a>-API (Cloudflare-Infrastruktur) übermittelt. Aus diesem Teil-Hash lässt sich das Passwort
        nicht rekonstruieren.
      </p>
      <p>
        <strong>Rechtsgrundlage:</strong> Einwilligung durch aktives Einschalten der Funktion
        (Art. 6 Abs. 1 lit. a DSGVO).
      </p>

      <h2>Erben &amp; Teilen / Inaktivitäts-Tresor (optional)</h2>
      <p>
        Pacto bietet die Möglichkeit, Vertrauenspersonen (&bdquo;Erben&ldquo;) zu hinterlegen, die im
        Ernstfall oder bei dauerhafter Inaktivität automatisch eine Übersicht deiner Verträge inkl.
        Kündigungsanleitungen per E-Mail erhalten. Diese Funktion ist optional, standardmäßig
        deaktiviert und setzt aktivierten Cloud-Sync voraus.
      </p>
      <ul>
        <li>Name und E-Mail-Adresse der von dir hinterlegten Erben werden zusammen mit deinen
          Vertragsdaten verschlüsselt bei Supabase gespeichert, damit der Versand auch dann
          funktioniert, wenn dein Gerät nicht mehr erreichbar ist.</li>
        <li>Als &bdquo;Lebenszeichen&ldquo; kannst du wahlweise eine jährliche Bestätigungs-E-Mail,
          einen automatischen Hintergrund-Heartbeat der App oder das bloße Öffnen der App festlegen.</li>
        <li>Bleibt ein Lebenszeichen über den von dir gewählten Zeitraum (30–180 Tage) plus 14 Tage
          Nachfrist aus, wird eine vorab von dir auf dem Gerät erstellte, verschlüsselte
          Zusammenfassung (optional inkl. PDF) über den E-Mail-Dienstleister{" "}
          <a href="https://resend.com" target="_blank" rel="noopener noreferrer">Resend</a> an die
          hinterlegten Erben verschickt.</li>
        <li>Vor Ablauf der Frist erhältst du selbst eine Vorwarnung mit der Möglichkeit, den Vorgang
          per Klick abzubrechen.</li>
      </ul>
      <p>
        Die E-Mail-Adressen deiner Erben sind personenbezogene Daten Dritter, die du selbst
        hinterlegst. Rechtsgrundlage hierfür ist unser berechtigtes Interesse und deines an der
        Kernfunktion der App (Art. 6 Abs. 1 lit. f DSGVO) — die Weitergabe von Vertrags- und
        Kündigungsinformationen an von dir benannte Vertrauenspersonen im Erb- bzw. Inaktivitätsfall.
        Bitte informiere deine Erben darüber, dass du ihre Kontaktdaten zu diesem Zweck hinterlegt hast.
      </p>

      <h2>Käufe (In-App-Kauf)</h2>
      <p>
        Die Freischaltung der Vollversion erfolgt als einmaliger In-App-Kauf über den Google Play
        Store bzw. Apple App Store. Die Zahlungsabwicklung selbst übernimmt vollständig Google bzw.
        Apple; Pacto erhält keine Zahlungs- oder Kreditkartendaten. Zur Prüfung, ob ein Kauf
        freigeschaltet ist, wird der Kaufbeleg an unseren Abo-/Kauf-Verwaltungsdienstleister{" "}
        <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer">
          RevenueCat
        </a> übermittelt, der anhand dessen eine anonyme Berechtigungsprüfung durchführt.
      </p>
      <p><strong>Rechtsgrundlage:</strong> Erfüllung des Kaufvertrags (Art. 6 Abs. 1 lit. b DSGVO).</p>

      <h2>Keine Werbung, kein Tracking</h2>
      <p>
        Pacto enthält keine Werbe-SDKs und keine Analyse-/Tracking-Dienste (z. B. kein Google
        Analytics, Firebase Analytics o. Ä.). Es findet keine Auswertung deines Verhaltens zu
        Werbezwecken statt und deine Daten werden nicht an Dritte verkauft.
      </p>

      <h2>Speicherdauer</h2>
      <p>
        Lokale Daten bleiben gespeichert, bis du sie löschst oder die App deinstallierst. Bei
        aktiviertem Cloud-Sync werden die verschlüsselten Daten gelöscht, sobald du den Sync in den
        Einstellungen deaktivierst und die Löschung bestätigst, oder auf Anfrage über die
        Kontaktadresse oben.
      </p>

      <h2>Deine Rechte</h2>
      <p>
        Du hast nach der DSGVO das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung
        (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie
        Widerspruch (Art. 21) gegen die Verarbeitung deiner Daten. Da die meisten Daten lokal auf
        deinem Gerät liegen, kannst du viele dieser Rechte direkt in der App selbst wahrnehmen
        (Bearbeiten/Löschen von Einträgen, Deaktivieren von Cloud-Funktionen). Für Anfragen zu bei uns
        gespeicherten Cloud-Daten wende dich an die oben genannte Kontaktadresse. Du hast zudem das
        Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren.
      </p>

      <h2>Änderungen dieser Erklärung</h2>
      <p>
        Diese Datenschutzerklärung kann angepasst werden, wenn sich die App oder die rechtlichen
        Anforderungen ändern. Die jeweils aktuelle Version findest du unter dieser URL.
      </p>
    </article>
  );
}
