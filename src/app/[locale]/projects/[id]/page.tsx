import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BuyShareForm } from "./_components/BuyShareForm";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Users, TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id, locale } = await params;

  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/auth/signin`);

  const profile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
  });

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const t = await getTranslations("ProjectsPage");
  const currentLocale = await getLocale();

  const title = currentLocale === "bn" ? project.titleBn : project.titleEn;
  const description = currentLocale === "bn" ? project.descriptionBn : project.descriptionEn;
  const soldShares = project.totalShares - project.availableShares;
  const progressPct = Math.round((soldShares / project.totalShares) * 100);

  // Get user's existing orders for this project
  const myOrders = await prisma.shareOrder.findMany({
    where: { userId: session.user.id, projectId: id },
    orderBy: { createdAt: "desc" },
  });

  const myApprovedShares = myOrders
    .filter((o: { status: string }) => o.status === "APPROVED")
    .reduce((sum: number, o: { quantity: number }) => sum + o.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back */}
        <Link
          href={`/${currentLocale}/projects`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToProjects")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Project info */}
          <div className="lg:col-span-2 space-y-6">
            {project.imageUrl && (
              <div className="relative w-full h-64 rounded-xl overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold">{title}</h1>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    project.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : project.status === "CLOSED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t(`status_${project.status}`)}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: t("totalCapital"), value: `৳${project.totalCapital.toLocaleString()}`, icon: Banknote },
                { label: t("pricePerShare"), value: `৳${project.pricePerShare.toLocaleString()}`, icon: TrendingUp },
                { label: t("availableShares"), value: `${project.availableShares}/${project.totalShares}`, icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <Card key={label}>
                  <CardContent className="pt-4">
                    <Icon className="h-5 w-5 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-bold text-lg">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("sold")}: {soldShares} {t("shares")}</span>
                  <span className="font-semibold">{progressPct}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div
                    className="bg-primary rounded-full h-3 transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* My existing orders */}
            {myOrders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("myOrders")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {myOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                      <span>{order.quantity} {t("shares")} × ৳{order.pricePerShare}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          order.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                  {myApprovedShares > 0 && (
                    <p className="text-sm font-semibold pt-2 text-green-700">
                      {t("totalApprovedShares")}: {myApprovedShares}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Buy form */}
          <div>
            {profile?.isApproved && project.status === "ACTIVE" && project.availableShares > 0 ? (
              <BuyShareForm project={project} />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  {!profile?.isApproved
                    ? t("pendingNotice")
                    : project.availableShares === 0
                    ? t("soldOut")
                    : t("projectClosed")}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
