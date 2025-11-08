// src/app/[locale]/layout.tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/Navbar";
import Script from "next/script";
import Footer from "@/components/layout/Footer";
import SessionProvider from "@/components/providers/SessionProvider";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  // Handle both Promise and resolved params
  const resolvedParams = await Promise.resolve(params);
  const { locale } = resolvedParams;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  return (
    <SessionProvider>
      {/* Initialize theme before hydration */}
      <Script id="theme-init" strategy="beforeInteractive">
        {`
          try {
            const stored = localStorage.getItem('theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const useDark = stored ? stored === 'dark' : prefersDark;
            if (useDark) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
          } catch (e) {}
        `}
      </Script>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">{children}</main>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </div>
    </SessionProvider>
  );
}