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

export const metadata = {
  title: "LavaTop",
  description:
    "Sistema de agendamento online para lava rápidos e estética automotiva.",

  openGraph: {
    title: "LavaTop",
    description:
      "Sistema de agendamento online para lava rápidos.",
    url: "https://lavatop.com.br",
    siteName: "LavaTop",

    images: [
      {
        url: "https://lavatop.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "LavaTop",
      },
    ],

    locale: "pt_BR",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
