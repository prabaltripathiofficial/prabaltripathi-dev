import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Prabal Tripathi — Software Engineer",
    template: "%s | Prabal Tripathi",
  },
  description:
    "Software Engineer at Keploy | GSoC Mentor | Building scalable systems & crafting elegant code. Read my blog on engineering, system design, and developer tooling.",
  keywords: [
    "Prabal Tripathi",
    "Software Engineer",
    "Full Stack Developer",
    "Blog",
    "Keploy",
    "GSoC",
    "System Design",
    "Web Development",
  ],
  authors: [{ name: "Prabal Tripathi" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Prabal Tripathi",
    title: "Prabal Tripathi — Software Engineer",
    description: "Software Engineer at Keploy | GSoC Mentor | Building scalable systems & crafting elegant code.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prabal Tripathi — Software Engineer",
    description: "Software Engineer at Keploy | GSoC Mentor | Building scalable systems & crafting elegant code.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="noise-bg min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111118",
                color: "#fafafa",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
