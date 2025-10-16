// =============================================
// src/app/layout.tsx (Snippet) – Branding & Background einbinden
// =============================================
import type { Metadata } from "next";
import "./globals.css";
import Background from "@/components/Background";
import { BrandHeader } from "@/components/BrandHeader";


export const metadata: Metadata = {
title: "Softbrew Studio – Tools für Macher",
description: "Drei Produkte, ein Ziel: weniger Frust, mehr Ergebnis.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="de" className="h-full bg-softbrew-black text-white">
<body className="min-h-screen antialiased selection:bg-softbrew-blue/40 selection:text-white">
<Background />
<BrandHeader />
<main className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:py-16">
{children}
</main>
<footer className="relative z-10 mt-20 border-t border-white/15 py-8 text-sm text-white/70">
<div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
<span>© {new Date().getFullYear()} Softbrew Studio</span>
<div className="flex items-center gap-4">
<a href="/impressum" className="hover:text-white">Impressum</a>
<a href="/datenschutz" className="hover:text-white">Datenschutz</a>
</div>
</div>
</footer>
</body>
</html>
);
}
