import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PenaltyVerse — Transelo Eventos | World Cup Penalty Simulator",
  description:
    "Simulador inmersivo de penaltis mundialistas. Enfrenta a El Dibu Martínez y Manuel Neuer en una experiencia 3D hiperrealista. Powered by Transelo Eventos.",
  keywords: ["penaltis", "mundial 2026", "simulador", "futbol", "Transelo Eventos"],
  openGraph: {
    title: "PenaltyVerse — Transelo Eventos",
    description: "Simulador inmersivo de penaltis mundialistas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050505] overflow-hidden">{children}</body>
    </html>
  );
}
