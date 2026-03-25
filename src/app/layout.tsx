import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { PageTransition } from "@/components/layout/PageTransition/PageTransition";
import { BackToTop } from "@/components/ui/BackToTop/BackToTop";
import { GridBackground } from "@/components/ui/GridBackground/GridBackground";
import "./globals.css";
import "@/styles/prism.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Providers } from "@/components/layout/Providers/Providers";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rasyidfirdaus.vercel.app'),
  title: "Rasyid Firdaus Harmaini",
  description: "Multidisciplinary Engineer: Bridging Web Development, Data Science, and Infrastructure Security.",
  openGraph: {
    title: "Rasyid Firdaus Harmaini",
    description: "Multidisciplinary Engineer: Bridging Web Development, Data Science, and Infrastructure Security.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rasyidfirdaus.vercel.app',
    siteName: 'Rasyid Firdaus Harmaini Portfolio',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rasyid Firdaus Harmaini",
    description: "Multidisciplinary Engineer",
    images: ['/api/og'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Rasyid Firdaus Harmaini',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rasyidfirdaus.vercel.app',
              jobTitle: 'Multidisciplinary Engineer',
              knowsAbout: ['Web Development', 'Data Science', 'Machine Learning', 'Cybersecurity', 'Networking'],
            }),
          }}
        />
        <Providers>
          <GridBackground />
          <Navbar />
          {children}
          <Footer />
          <BackToTop />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
