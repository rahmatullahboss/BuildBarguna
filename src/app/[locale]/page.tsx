// src/app/[locale]/page.tsx
import { useTranslations } from "next-intl";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedDiv } from "@/components/AnimatedDiv";
import { ArrowRight, Users, TrendingUp, Award, CheckCircle, Star } from "lucide-react";

const prisma = new PrismaClient();

async function getKpis() {
  try {
    const kpis = await prisma.kPI.findMany();
    return kpis;
  } catch {
    return [
      { id: "1", metric: "members_joined", value: 150, labelEn: "Members Joined", labelBn: "সদস্য যোগদান করেছেন" },
      { id: "2", metric: "ventures_funded", value: 8, labelEn: "Ventures Funded", labelBn: "উদ্যোগ অর্থায়ন করা হয়েছে" },
      { id: "3", metric: "training_hours", value: 2400, labelEn: "Training Hours", labelBn: "প্রশিক্ষণ ঘন্টা" },
    ];
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const kpis = await getKpis();
  return <HomeContent kpis={kpis} locale={locale} />;
}

function HomeContent({ kpis, locale }: { kpis: Array<{ id: string; metric: string; value: number; labelEn: string; labelBn: string }> , locale: string }) {
  const t = useTranslations("HomePage");

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        {/* Gradient Overlays */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedDiv>
            <div className="inline-flex items-center px-4 py-2 bg-secondary/90 text-foreground rounded-full text-sm font-medium mt-8 sm:mt-0 mb-8 shadow-sm ring-1 ring-primary/10">
              <Star className="w-4 h-4 mr-2 text-primary" />
              {t("badge")}
            </div>
          </AnimatedDiv>
          
          <AnimatedDiv delay={0.1}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              <span className="block">{t("heroTitle")}</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-500 dark:to-fuchsia-400">
                {t("heroHighlight")}
              </span>
            </h1>
            <p className="text-lg font-medium text-muted-foreground mt-4 italic">
              &ldquo;{t("tagline")}&rdquo;
            </p>
          </AnimatedDiv>
          
          <AnimatedDiv delay={0.2}>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </AnimatedDiv>
          
          <AnimatedDiv delay={0.3} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button asChild size="lg" className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Link href={`/${locale}/join-member`} className="relative flex items-center overflow-hidden">
                {/* Shine */}
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-white/0 via-white/20 to-white/0 skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-700" />
                </span>
                {t("ctaJoin")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="relative overflow-hidden border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg rounded-full transition-all duration-300 group">
              <Link href={`/${locale}/programs`} className="relative overflow-hidden">
                {/* Shine */}
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-white/0 via-white/20 to-white/0 skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-700" />
                </span>
                {t("ctaPrograms")}
              </Link>
            </Button>
          </AnimatedDiv>

          {/* Year-1 Focus Cards */}
          <AnimatedDiv delay={0.4} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform">
                  Foundation Building
                </div>
                <div className="text-muted-foreground font-medium">Transparent Process</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform">
                  Pilot Programs
                </div>
                <div className="text-muted-foreground font-medium">Learn & Scale</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform">
                  Community Focus
                </div>
                <div className="text-muted-foreground font-medium">Member-Driven</div>
              </CardContent>
            </Card>
          </AnimatedDiv>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="relative py-20 bg-background overflow-hidden">
        {/* Soft background accents */}
        <div className="pointer-events-none absolute -top-20 left-10 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-primary/10 blur-2xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedDiv className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{t("pillarsTitle")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("pillarsSubtitle")}</p>
          </AnimatedDiv>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <AnimatedDiv delay={0.2}>
              <Card className="h-full bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{t("pillar1Title")}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{t("pillar1Desc")}</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {t("pillar1Feature1")}
                    </li>
                    <li className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {t("pillar1Feature2")}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedDiv>

            <AnimatedDiv delay={0.4}>
              <Card className="h-full bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 dark:to-accent/60 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{t("pillar2Title")}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{t("pillar2Desc")}</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {t("pillar2Feature1")}
                    </li>
                    <li className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {t("pillar2Feature2")}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedDiv>

            <AnimatedDiv delay={0.6}>
              <Card className="h-full bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Award className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{t("pillar3Title")}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{t("pillar3Desc")}</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {t("pillar3Feature1")}
                    </li>
                    <li className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {t("pillar3Feature2")}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedDiv>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-secondary dark:bg-accent overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-16 left-1/3 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedDiv>
            <h2 className="text-4xl font-bold text-foreground mb-4">{t("ctaTitle")}</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("ctaSubtitle")}</p>
            <Button asChild size="lg" className="relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Link href={`/${locale}/join-member`} className="relative flex items-center overflow-hidden">
                {/* Shine */}
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-white/0 via-white/20 to-white/0 skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-700" />
                </span>
                {t("ctaButton")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </AnimatedDiv>
        </div>
      </section>
    </div>
  );
}