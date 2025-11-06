// src/app/[locale]/page.tsx
import { useTranslations } from "next-intl";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedDiv } from "@/components/AnimatedDiv";
// A simple component to render the KPI counters - we'll create this next
// import KpiCounters from "@/components/KpiCounters";

const prisma = new PrismaClient();

async function getKpis() {
  try {
    const kpis = await prisma.kPI.findMany();
    return kpis;
  } catch {
    // Fallback to mock data if database is not available
    return [
      { id: "1", metric: "members_joined", value: 150, labelEn: "Members Joined", labelBn: "সদস্য যোগদান করেছেন" },
      { id: "2", metric: "ventures_funded", value: 8, labelEn: "Ventures Funded", labelBn: "উদ্যোগ অর্থায়ন করা হয়েছে" },
      { id: "3", metric: "training_hours", value: 2400, labelEn: "Training Hours", labelBn: "প্রশিক্shaন ঘন্টা" },
    ];
  }
}

export default async function Home() {
  // We need to fetch data first, then render the component
  const kpis = await getKpis();
  
  // We'll pass the data to a client component for rendering
  return <HomeContent kpis={kpis} />;
}

function HomeContent({ kpis: _kpis }: { kpis: Array<{ id: string; metric: string; value: number; labelEn: string; labelBn: string }> }) {
  const t = useTranslations("HomePage");

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-stone-50 text-center py-20">
        <div className="container mx-auto">
          <AnimatedDiv>
            <h1 className="text-5xl font-extrabold text-stone-800 tracking-tight">
              {t("heroTitle")}
            </h1>
          </AnimatedDiv>
          <AnimatedDiv delay={0.2}>
            <p className="mt-4 text-xl text-stone-600 max-w-2xl mx-auto">
              {t("heroSubtitle")}
            </p>
          </AnimatedDiv>
          <AnimatedDiv delay={0.4} className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/members">{t("ctaJoin")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/programs">{t("ctaPrograms")}</Link>
            </Button>
          </AnimatedDiv>
        </div>
      </section>

      {/* KPI Counters Section */}
      {/* <KpiCounters kpis={kpis} /> */}

      {/* Three Pillars Section */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <AnimatedDiv>
            <h2 className="text-3xl font-bold text-stone-800">{t("pillarsTitle")}</h2>
          </AnimatedDiv>
          <div className="mt-12 grid md:grid-cols-3 gap-12">
            <AnimatedDiv delay={0.2} className="text-center">
                <h3 className="text-2xl font-semibold">{t("pillar1Title")}</h3>
                <p className="mt-2 text-stone-600">{t("pillar1Desc")}</p>
            </AnimatedDiv>
            <AnimatedDiv delay={0.4} className="text-center">
                <h3 className="text-2xl font-semibold">{t("pillar2Title")}</h3>
                <p className="mt-2 text-stone-600">{t("pillar2Desc")}</p>
            </AnimatedDiv>
            <AnimatedDiv delay={0.6} className="text-center">
                <h3 className="text-2xl font-semibold">{t("pillar3Title")}</h3>
                <p className="mt-2 text-stone-600">{t("pillar3Desc")}</p>
            </AnimatedDiv>
          </div>
        </div>
      </section>
    </div>
  );
}