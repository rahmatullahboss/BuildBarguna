"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

// ─── Helper: today's date window ──────────────────────────────────────────
function getTodayWindow(): { today: Date; tomorrow: Date } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { today, tomorrow };
}

async function requireApprovedMember() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile?.isApproved) throw new Error("Only approved members can perform this action.");

  return session.user;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") throw new Error("Admin access required.");
  return session.user;
}

// ─── Member: Get active tasks with completion status ──────────────────────
export async function getDailyTasksWithStatus() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const tasks = await prisma.dailyTask.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  // Check today's completions
  const { today, tomorrow } = getTodayWindow();

  const completions = await prisma.taskCompletion.findMany({
    where: {
      userId: session.user.id,
      completedAt: { gte: today, lt: tomorrow },
    },
    select: { taskId: true },
  });

  const completedTaskIds = new Set(completions.map((c) => c.taskId));

  return tasks.map((task) => ({
    ...task,
    completedToday: completedTaskIds.has(task.id),
  }));
}

// ─── Member: Complete a task ──────────────────────────────────────────────
export async function completeTaskAction(
  taskId: string
): Promise<{ success: boolean; message: string; points?: number }> {
  try {
    const user = await requireApprovedMember();

    const task = await prisma.dailyTask.findUnique({ where: { id: taskId } });
    if (!task || !task.isActive) return { success: false, message: "Task not found or inactive." };

    // Check if already completed today
    const { today, tomorrow } = getTodayWindow();

    const existing = await prisma.taskCompletion.findFirst({
      where: {
        userId: user.id,
        taskId,
        completedAt: { gte: today, lt: tomorrow },
      },
    });

    if (existing) return { success: false, message: "You already completed this task today." };

    // Award points — use upsert+skipDuplicates pattern to prevent race condition double-completion
    try {
      await prisma.$transaction(async (tx) => {
        // Normalize completedAt to start of today to enforce daily uniqueness at DB level
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);

        await tx.taskCompletion.create({
          data: { userId: user.id!, taskId, completedAt: todayMidnight },
        });

        const wallet = await tx.wallet.upsert({
          where: { userId: user.id! },
          update: {},
          create: { userId: user.id!, balance: 0, points: 0 },
        });

        await tx.wallet.update({
          where: { id: wallet.id },
          data: { points: { increment: task.pointReward } },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: "TASK_REWARD",
            amount: task.pointReward,
            description: `Completed task: ${task.titleEn}`,
          },
        });
      });
    } catch (txError) {
      // Unique constraint violation means already completed today (race condition caught at DB level)
      if ((txError as { code?: string })?.code === "P2002") {
        return { success: false, message: "You already completed this task today." };
      }
      throw txError;
    }

    revalidatePath("/en/daily-tasks");
    revalidatePath("/bn/daily-tasks");
    revalidatePath("/en/dashboard");
    revalidatePath("/bn/dashboard");

    return { success: true, message: `Task completed! +${task.pointReward} points earned.`, points: task.pointReward };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

// ─── Admin: CRUD Daily Tasks ──────────────────────────────────────────────
export type TaskFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function getAllTasksAdmin() {
  await requireAdmin();
  return prisma.dailyTask.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { completions: true } } },
  });
}

export async function createTaskAction(
  prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  try {
    await requireAdmin();

    const raw = {
      titleEn: formData.get("titleEn"),
      titleBn: formData.get("titleBn"),
      platform: formData.get("platform"),
      url: formData.get("url"),
      pointReward: formData.get("pointReward") || "10",
      isActive: formData.get("isActive") === "true",
    };

    const validated = createTaskSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await prisma.dailyTask.create({ data: validated.data });

    revalidatePath("/en/admin/tasks");
    revalidatePath("/bn/admin/tasks");

    return { success: true, message: "Task created!" };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

export async function updateTaskAction(
  id: string,
  prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  try {
    await requireAdmin();

    const raw = {
      titleEn: formData.get("titleEn"),
      titleBn: formData.get("titleBn"),
      platform: formData.get("platform"),
      url: formData.get("url"),
      pointReward: formData.get("pointReward") || "10",
      isActive: formData.get("isActive") === "true",
    };

    const validated = createTaskSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await prisma.dailyTask.update({ where: { id }, data: validated.data });

    revalidatePath("/en/admin/tasks");
    revalidatePath("/bn/admin/tasks");

    return { success: true, message: "Task updated!" };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

export async function deleteTaskAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin();
    await prisma.dailyTask.delete({ where: { id } });
    revalidatePath("/en/admin/tasks");
    revalidatePath("/bn/admin/tasks");
    return { success: true, message: "Task deleted." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

