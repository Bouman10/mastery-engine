import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mastery — Structured Learning for Ambitious Minds",
  description:
    "Stop consuming. Start mastering. A structured 20/60/20 learning system — Learn, Build, Refine — built for the ambitious 18-35 generation.",
  openGraph: {
    title: "Mastery — Stop consuming. Start mastering.",
    description:
      "Structured learning that creates real skill. Not intensity. Consistency + correction.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body className="bg-stone-50 text-stone-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
