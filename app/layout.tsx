import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "¿Greenwashed? — Verificador de ofertas de sostenibilidad",
  description:
    "Pega una oferta de empleo del área de sostenibilidad y detecta señales de greenwashing antes de postularte.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${serif.variable} ${mono.variable} font-serif`}>
        {children}
      </body>
    </html>
  );
}
