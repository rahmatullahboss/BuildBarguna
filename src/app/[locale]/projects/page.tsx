import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Banknote, ShoppingCart } from "lucide-react";
import type { ProjectStatus } from "@prisma/client";

export default async function ProjectsPage() {
  const session = await auth();
  const locale = await getLocale();
  if (!session?.user?.id) redirect(`/${locale}/auth/signin`);

  const profile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
  });

  const t = await getTranslations("ProjectsPage");

  const projects = await prisma.project.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  const statusColor: Record<ProjectStatus, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    CLOSED: "bg-red-100 text-red-700",
    PAUSED: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
        </div>

        {/* Pending member notice */}
        {!profile?.isApproved && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950/20 dark:border-yellow-800">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
              {t("pendingNotice")}
            </p>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <TrendingUp className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg">{t("noProjects")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: { id: string; titleEn: string; titleBn: string; descriptionEn: string; descriptionBn: string; totalCapital: number; totalShares: number; pricePerShare: number; availableShares: number; status: ProjectStatus; imageUrl: string | null }) => {
              const title = locale === "bn" ? project.titleBn : project.titleEn;
              const description = locale === "bn" ? project.descriptionBn : project.descriptionEn;
              const soldShares = project.totalShares - project.availableShares;
              const progressPct = Math.round((soldShares / project.totalShares) * 100);

              return (
                <Card key={project.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  {project.imageUrl && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={project.imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-snug">{title}</CardTitle>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusColor[project.status]}`}
                      >
                        {t(`status_${project.status}`)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground text-xs">{t("pricePerShare")}</p>
                          <p className="font-semibold">৳{project.pricePerShare.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground text-xs">{t("availableShares")}</p>
                          <p className="font-semibold">{project.availableShares}/{project.totalShares}</p>
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{t("sold")}: {soldShares}</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">{t("totalCapital")}: </span>
                      <span className="font-semibold">৳{project.totalCapital.toLocaleString()}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {profile?.isApproved && project.availableShares > 0 ? (
                      <Link href={`/${locale}/projects/${project.id}`} className="w-full">
                        <Button className="w-full gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          {t("buyShares")}
                        </Button>
                      </Link>
                    ) : (
                      <Button className="w-full" disabled>
                        {project.availableShares === 0 ? t("soldOut") : t("notEligible")}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
