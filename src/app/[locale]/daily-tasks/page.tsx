import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DailyTaskList } from "./_components/DailyTaskList";
import { Star, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function DailyTasksPage() {
  const session = await auth();
  const locale = await getLocale();
  if (!session?.user?.id) redirect(`/${locale}/auth/signin`);

  const profile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
  });

  const t = await getTranslations("DailyTasksPage");

  const tasks = await prisma.dailyTask.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  // Today's completions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const completions = await prisma.taskCompletion.findMany({
    where: {
      userId: session.user.id,
      completedAt: { gte: today, lt: tomorrow },
    },
    select: { taskId: true },
  });
  const completedTaskIds = new Set(completions.map((c: { taskId: string }) => c.taskId));

  const tasksWithStatus = tasks.map((task: { id: string; titleEn: string; titleBn: string; platform: string; url: string; pointReward: number; isActive: boolean }) => ({
    ...task,
    completedToday: completedTaskIds.has(task.id),
  }));

  const totalTasks = tasks.length;
  const completedCount = completions.length;

  // Get wallet points
  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
    select: { points: true },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full dark:bg-green-950/30">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}/{totalTasks}</p>
                <p className="text-xs text-muted-foreground">{t("todayProgress")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-950/30">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{wallet?.points ?? 0}</p>
                <p className="text-xs text-muted-foreground">{t("totalPoints")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Not approved notice */}
        {!profile?.isApproved && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950/20">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">{t("pendingNotice")}</p>
          </div>
        )}

        {/* Task list */}
        <DailyTaskList
          tasks={tasksWithStatus}
          isApproved={profile?.isApproved ?? false}
          locale={locale}
        />
      </div>
    </div>
  );
}
