export const metadata = { title: "Impressum – Softbrew Studio" };

export default function Page() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <h1>Impressum</h1>

      <p><strong>Softbrew Studio</strong><br/>
      Ulrich Wallis<br/>
      {/* Deine ladungsfähige Anschrift hier einsetzen */}
      Industriestr. 14a<br/>
      28857 Syke<br/>
      Deutschland</p>

      <p>
        E-Mail: <a href="mailto:support@softbrewstudio.com">support@softbrewstudio.com</a><br/>
        Vertreten durch: Ulrich Wallis
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte nach den allgemeinen Gesetzen verantwortlich.
      Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
      Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>

      <h2>Haftung für Links</h2>
      <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb
      können wir für diese fremden Inhalte auch keine Gewähr übernehmen.</p>

      <h2>Urheberrecht</h2>
      <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
      Urheberrecht.</p>

      <p>Inhaltlich verantwortlich gemäß § 55 Abs. 2 RStV: Ulrich Wallis</p>
    </article>
  );
}
