import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
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
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050505] overflow-hidden">{children}</body>
    </html>
  );
}
