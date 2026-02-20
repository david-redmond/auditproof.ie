import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import "@/lib/env";
import "./globals.css";
import CookieConsentProvider from "@/components/CookieConsentProvider";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import AnalyticsPageView from "@/components/AnalyticsPageView";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GDPR Evidence — Audit-ready records for small businesses",
  description:
    "Keep your GDPR evidence organised, timestamped, and ready to export. Built for Irish SMEs. No legal advice. No unnecessary complexity.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} ${ibmPlexSerif.variable} ${ibmPlexMono.variable}`}>
        <CookieConsentProvider>
          <AnalyticsScripts />
          <AnalyticsPageView />
          <a href="#main-content" className="skipLink">
            Skip to main content
          </a>
          {children}
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
