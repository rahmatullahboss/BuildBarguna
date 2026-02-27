"use client";

import { useTranslations } from "next-intl";
import { completeTaskAction } from "@/lib/actions/task.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, CheckCircle, Star, Facebook, Youtube, Instagram, Globe } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  titleEn: string;
  titleBn: string;
  platform: string;
  url: string;
  pointReward: number;
  completedToday: boolean;
}

interface Props {
  tasks: Task[];
  isApproved: boolean;
  locale: string;
}

const platformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("facebook")) return <Facebook className="h-5 w-5 text-blue-600" />;
  if (p.includes("youtube")) return <Youtube className="h-5 w-5 text-red-600" />;
  if (p.includes("instagram")) return <Instagram className="h-5 w-5 text-pink-600" />;
  return <Globe className="h-5 w-5 text-muted-foreground" />;
};

export function DailyTaskList({ tasks, isApproved, locale }: Props) {
  const t = useTranslations("DailyTasksPage");
  const [completing, setCompleting] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(tasks.filter((t) => t.completedToday).map((t) => t.id))
  );
  const [isPending, startTransition] = useTransition();

  const handleComplete = (taskId: string) => {
    if (!isApproved || completedIds.has(taskId)) return;
    setCompleting(taskId);
    startTransition(async () => {
      const result = await completeTaskAction(taskId);
      if (result.success) {
        setCompletedIds((prev) => new Set([...prev, taskId]));
        toast({ title: result.message, variant: "default" });
      } else {
        toast({ title: result.message, variant: "destructive" });
      }
      setCompleting(null);
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Star className="mx-auto h-12 w-12 mb-4 opacity-30" />
        <p>{t("noTasks")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const title = locale === "bn" ? task.titleBn : task.titleEn;
        const isDone = completedIds.has(task.id);
        const isLoading = completing === task.id;

        return (
          <Card
            key={task.id}
            className={`transition-all ${isDone ? "opacity-70 bg-secondary/50" : "hover:shadow-md"}`}
          >
            <CardContent className="pt-4 flex items-center gap-4">
              {/* Platform icon */}
              <div className="p-2 bg-background border rounded-full shrink-0">
                {platformIcon(task.platform)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>
                  {title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{task.platform}</p>
              </div>

              {/* Points badge */}
              <div className="flex items-center gap-1 text-purple-600 font-semibold text-sm shrink-0">
                <Star className="h-3.5 w-3.5" />
                +{task.pointReward}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title={t("openLink")}
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>

                {isDone ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium px-3 py-1.5 bg-green-50 rounded-lg dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4" />
                    {t("done")}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleComplete(task.id)}
                    disabled={!isApproved || isLoading || isPending}
                  >
                    {isLoading ? t("completing") : t("complete")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
