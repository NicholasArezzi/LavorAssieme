import type { Metadata } from "next";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "LavorAssieme – Trova lavoro o candidati in Italia",
  description: "La piattaforma italiana che connette candidati e aziende. Semplice, veloce, efficace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
