import "./globals.css";

export const metadata = {
  title: "Softbrew Studio – Build. Focus. Learn.",
  description: "FocusPilot, Shiftrix und LinguAI von Softbrew Studio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-softbrew-black/95 backdrop-blur border-b border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            {/* Wortmarke – Logo kommt später */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">Softbrew</span>
              <span className="text-xl md:text-2xl font-semibold text-softbrew-blue tracking-tight">
                Studio
              </span>
            </a>

            <nav className="hidden sm:flex gap-5 text-sm">
              <a href="/focuspilot" className="text-white/85 hover:text-white">FocusPilot</a>
              <a href="/shiftrix"   className="text-white/85 hover:text-white">Shiftrix</a>
              <a href="/linguai"    className="text-white/85 hover:text-white">LinguAI</a>
              <a href="/updates"    className="text-white/85 hover:text-white">Updates</a>
              <a href="/kontakt"    className="text-white/85 hover:text-white">Kontakt</a>
            </nav>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/80">
            <p>© {new Date().getFullYear()} Softbrew Studio</p>
            <div className="flex gap-4">
              <a href="https://linktr.ee/softbrewstudio" className="hover:text-white">Linktree</a>
              <a href="/impressum" className="hover:text-white">Impressum</a>
              <a href="/datenschutz" className="hover:text-white">Datenschutz</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

