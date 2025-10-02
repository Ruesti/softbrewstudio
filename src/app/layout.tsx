// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
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
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">Softbrew</span>
              <span className="text-xl md:text-2xl font-semibold text-softbrew-blue tracking-tight">
                Studio
              </span>
            </Link>

            <nav className="hidden sm:flex gap-5 text-sm">
              <Link href="/focuspilot" className="text-white/85 hover:text-white">FocusPilot</Link>
              <Link href="/shiftrix"   className="text-white/85 hover:text-white">Shiftrix</Link>
              <Link href="/linguai"    className="text-white/85 hover:text-white">LinguAI</Link>
              <Link href="/updates"    className="text-white/85 hover:text-white">Updates</Link>
              <Link href="/kontakt"    className="text-white/85 hover:text-white">Kontakt</Link>
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
              {/* Extern bleibt <a> */}
              <a
                href="https://linktr.ee/softbrewstudio"
                className="hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Linktree
              </a>
              {/* Intern mit Link */}
              <Link href="/impressum" className="hover:text-white">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-white">Datenschutz</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

