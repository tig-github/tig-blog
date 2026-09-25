import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "../utils/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tig Blog",
    template: "%s | Tig Blog",
  },
  description: "Blog by tig for tig",
  openGraph: {
    type: "website",
    siteName: "Tig Blog",
    title: "Tig Blog",
    description: "Blog by tig for tig",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Tig Blog",
    description: "Blog by tig for tig",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body>
          <Nav />
          {children}
          <Footer />
        </body>
      </html>
      <Analytics />
    </>
  );
}
