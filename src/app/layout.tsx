export const metadata = {
  title: "Softbrew Studio – Build. Focus. Learn.",
  description: "Softbrew Studio baut FocusPilot, Shiftrix und LinguAI.",
  openGraph: {
    title: "Softbrew Studio",
    description: "Build. Focus. Learn.",
    url: "https://softbrewstudio.com",
    siteName: "Softbrew Studio",
    images: [],
    locale: "de_DE",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

...

<footer className="mt-20 border-t border-softbrew.gray/60 py-8 text-sm">
  <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
    <p>© {new Date().getFullYear()} Softbrew Studio</p>
    <div className="flex gap-4">
      <a href="https://linktr.ee/softbrewstudio" className="hover:text-softbrew-blue">Linktree</a>
      <a href="/impressum" className="hover:text-softbrew-blue">Impressum</a>
      <a href="/datenschutz" className="hover:text-softbrew-blue">Datenschutz</a>
    </div>
  </div>
</footer>

