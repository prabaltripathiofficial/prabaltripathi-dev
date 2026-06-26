import type { Metadata } from "next";
import { Inter, PT_Serif, Archivo } from "next/font/google";
import "./globals.css";
import { NAME } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pt-serif",
  display: "swap",
});
const nimbus = Archivo({
  subsets: ["latin"],
  axes: ["wdth"], // width axis → pushed to expanded in globals.css (.nimbus)
  variable: "--font-nimbus",
  display: "swap",
});

export const metadata: Metadata = {
  title: NAME,
  description: `${NAME}'s personal website.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ptSerif.variable} ${nimbus.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
