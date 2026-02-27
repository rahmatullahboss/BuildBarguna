"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createDividendSchema } from "@/lib/schemas";
import { sendDividendCreditedEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") throw new Error("Admin access required.");
  return session.user;
}

// ─── Member: Get my wallet ────────────────────────────────────────────────
export async function getMyWallet() {
  const session = await auth();
  if (!session?.user?.id) return null;

  let wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
    include: {
      transactions: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  // Auto-create wallet if not exists — use upsert to prevent race condition
  if (!wallet) {
    wallet = await prisma.wallet.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id, balance: 0, points: 0 },
      include: { transactions: { orderBy: { createdAt: "desc" }, take: 50 } },
    });
  }

  return wallet;
}

// ─── Admin: Get all dividends ─────────────────────────────────────────────
export async function getAllDividends() {
  await requireAdmin();
  return prisma.dividend.findMany({
    include: { project: { select: { titleEn: true, titleBn: true } } },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Admin: Create & distribute dividend ─────────────────────────────────
export type DividendFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createDividendAction(
  prevState: DividendFormState,
  formData: FormData
): Promise<DividendFormState> {
  try {
    await requireAdmin();

    const raw = {
      projectId: formData.get("projectId"),
      month: formData.get("month"),
      year: formData.get("year"),
      percentage: formData.get("percentage"),
      totalAmount: formData.get("totalAmount"),
      note: formData.get("note") || "",
    };

    const validated = createDividendSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    await prisma.dividend.create({ data: validated.data });

    revalidatePath("/en/admin/dividends");
    revalidatePath("/bn/admin/dividends");

    return { success: true, message: "Dividend record created!" };
  } catch (error) {
    // Handle duplicate dividend for same project/month/year
    if (
      (error instanceof Error && error.message.includes("Unique constraint")) ||
      (error as { code?: string })?.code === "P2002"
    ) {
      return { success: false, message: "A dividend for this project and period already exists." };
    }
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

// ─── Admin: Distribute dividend to all shareholders ───────────────────────
export async function distributeDividendAction(
  dividendId: string
): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin();

    const dividend = await prisma.dividend.findUnique({
      where: { id: dividendId },
      include: { project: true },
    });

    if (!dividend) return { success: false, message: "Dividend not found." };
    if (dividend.isDistributed) return { success: false, message: "Already distributed." };

    // Get all APPROVED share orders for this project
    const approvedOrders = await prisma.shareOrder.findMany({
      where: { projectId: dividend.projectId, status: "APPROVED" },
      include: { user: { select: { email: true, name: true } } },
    });

    if (approvedOrders.length === 0) {
      return { success: false, message: "No approved shareholders found." };
    }

    const totalShares = approvedOrders.reduce((sum, o) => sum + o.quantity, 0);

    await prisma.$transaction(async (tx) => {
      for (const order of approvedOrders) {
        // Calculate proportional dividend
        const userShare = order.quantity / totalShares;
        const userDividend = parseFloat((dividend.totalAmount * userShare).toFixed(2));

        // Ensure wallet exists
        let wallet = await tx.wallet.findUnique({ where: { userId: order.userId } });
        if (!wallet) {
          wallet = await tx.wallet.create({
            data: { userId: order.userId, balance: 0, points: 0 },
          });
        }

        // Credit wallet
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: userDividend } },
        });

        // Record transaction
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: "DIVIDEND",
            amount: userDividend,
            description: `Dividend for ${dividend.project.titleEn} — ${dividend.month}/${dividend.year} (${order.quantity} shares)`,
          },
        });
      }

      // Mark as distributed
      await tx.dividend.update({
        where: { id: dividendId },
        data: { isDistributed: true },
      });
    });

    revalidatePath("/en/admin/dividends");
    revalidatePath("/bn/admin/dividends");

    // Send email notifications — failures are isolated and won't affect the response
    await Promise.allSettled(
      approvedOrders.map((order) =>
        sendDividendCreditedEmail({
          recipientEmail: order.user.email,
          recipientName: order.user.name,
          projectTitle: dividend.project.titleEn,
          month: dividend.month,
          year: dividend.year,
          shares: order.quantity,
          dividendAmount: parseFloat((dividend.totalAmount * (order.quantity / totalShares)).toFixed(2)),
          newBalance: 0,
        })
      )
    );

    return { success: true, message: `Dividend distributed to ${approvedOrders.length} shareholders!` };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}
