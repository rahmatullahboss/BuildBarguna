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

export default async function Home() {
  const kpis = await getKpis();
  return <HomeContent kpis={kpis} />;
}

function HomeContent({ kpis }: { kpis: Array<{ id: string; metric: string; value: number; labelEn: string; labelBn: string }> }) {
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
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedDiv>
            <div className="inline-flex items-center px-4 py-2 bg-secondary text-foreground rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              {t("badge")}
            </div>
          </AnimatedDiv>
          
          <AnimatedDiv delay={0.1}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              <span className="block">{t("heroTitle")}</span>
              <span className="block text-foreground">
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
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Link href="/join-member" className="flex items-center">
                {t("ctaJoin")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg rounded-full transition-all duration-300">
              <Link href="/programs">{t("ctaPrograms")}</Link>
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
      <section className="py-20 bg-background">
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
                  <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{t("pillar2Title")}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{t("pillar2Desc")}</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-black mr-2 flex-shrink-0" />
                      {t("pillar2Feature1")}
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-black mr-2 flex-shrink-0" />
                      {t("pillar2Feature2")}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedDiv>

            <AnimatedDiv delay={0.6}>
              <Card className="h-full bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("pillar3Title")}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{t("pillar3Desc")}</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-black mr-2 flex-shrink-0" />
                      {t("pillar3Feature1")}
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-black mr-2 flex-shrink-0" />
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
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedDiv>
            <h2 className="text-4xl font-bold text-white mb-4">{t("ctaTitle")}</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{t("ctaSubtitle")}</p>
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/join-member" className="flex items-center">
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