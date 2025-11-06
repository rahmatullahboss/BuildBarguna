import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.buildbarguna.coop";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Build Barguna Co-op: Train. Co-invest. Build Barguna.",
    template: `%s | Build Barguna Co-op`,
  },
  description: "Uniting Barguna’s youth to create self-employment via skills training and member-pooled Joint Investment Projects (JIPs).",
  keywords: ["co-operative", "Barguna", "youth employment", "skills training", "investment", "Bangladesh"],
  openGraph: {
    title: "Build Barguna Co-op",
    description: "Uniting Barguna’s youth for self-employment and investment.",
    url: siteUrl,
    siteName: "Build Barguna Co-op",
    images: [
      {
        url: `${siteUrl}/og-image.png`, // Must be an absolute URL
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Barguna Co-op",
    description: "Uniting Barguna’s youth for self-employment and investment.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // Handle both Promise and resolved params
  const resolvedParams = await Promise.resolve(params);
  const { locale } = resolvedParams;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}