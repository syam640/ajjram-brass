import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ajjram Brass | Premium Heritage Brass & Handcrafted Artifacts",
  description: "India's premier heritage brass brand. Handcrafted puja items, idols, home decor, and utensils by master artisans since 1965.",
  keywords: "brass, puja items, brass idols, home decor, brass utensils, Indian handicrafts, heritage brass",
  openGraph: { title: "Ajjram Brass | Premium Heritage Brass Brand", description: "Handcrafted brass artifacts by master artisans since 1965." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
