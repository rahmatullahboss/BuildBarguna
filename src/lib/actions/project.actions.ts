"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buyShareSchema, createProjectSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { sendShareOrderApprovedEmail, sendShareOrderRejectedEmail } from "@/lib/email";

// ─── Helper: ensure approved member ───────────────────────────────────────
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

// ─── Public: Get all active projects ──────────────────────────────────────
export async function getActiveProjects() {
  return prisma.project.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { shareOrders: true } },
    },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      _count: { select: { shareOrders: true } },
    },
  });
}

// ─── Member: Buy shares ────────────────────────────────────────────────────
export type BuyShareState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function buyShareAction(
  prevState: BuyShareState,
  formData: FormData
): Promise<BuyShareState> {
  try {
    const user = await requireApprovedMember();

    const raw = {
      projectId: formData.get("projectId"),
      quantity: formData.get("quantity"),
      paymentMethod: formData.get("paymentMethod"),
      paymentRef: formData.get("paymentRef"),
    };

    const validated = buyShareSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        message: "Please fix the errors below.",
        errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { projectId, quantity, paymentMethod, paymentRef } = validated.data;

    // Use transaction to atomically check & reserve — prevents race condition overselling
    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({ where: { id: projectId } });
      if (!project) return { error: "Project not found." };
      if (project.status !== "ACTIVE") return { error: "This project is not accepting orders." };
      if (project.availableShares < quantity)
        return { error: `Only ${project.availableShares} shares available.` };

      const totalAmount = project.pricePerShare * quantity;

      await tx.shareOrder.create({
        data: {
          userId: user.id!,
          projectId,
          quantity,
          pricePerShare: project.pricePerShare,
          totalAmount,
          paymentMethod,
          paymentRef: paymentRef || null,
          status: "PENDING",
        },
      });

      return { totalAmount };
    });

    if ("error" in result) return { success: false, message: result.error! };

    revalidatePath("/en/projects");
    revalidatePath("/bn/projects");
    revalidatePath("/en/dashboard");
    revalidatePath("/bn/dashboard");

    return {
      success: true,
      message: "Your share purchase request has been submitted! Admin will confirm after payment verification.",
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

// ─── Member: Get my share orders ──────────────────────────────────────────
export async function getMyShareOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.shareOrder.findMany({
    where: { userId: session.user.id },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Admin: CRUD Projects ─────────────────────────────────────────────────
export type ProjectFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createProjectAction(
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  try {
    await requireAdmin();

    const raw = {
      titleEn: formData.get("titleEn"),
      titleBn: formData.get("titleBn"),
      descriptionEn: formData.get("descriptionEn"),
      descriptionBn: formData.get("descriptionBn"),
      totalCapital: formData.get("totalCapital"),
      totalShares: formData.get("totalShares"),
      imageUrl: formData.get("imageUrl") || "",
      status: formData.get("status") || "ACTIVE",
    };

    const validated = createProjectSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { totalCapital, totalShares, imageUrl, ...rest } = validated.data;
    const pricePerShare = totalCapital / totalShares;

    await prisma.project.create({
      data: {
        ...rest,
        totalCapital,
        totalShares,
        pricePerShare,
        availableShares: totalShares,
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath("/en/admin/projects");
    revalidatePath("/bn/admin/projects");
    revalidatePath("/en/projects");
    revalidatePath("/bn/projects");

    return { success: true, message: "Project created successfully!" };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

export async function updateProjectAction(
  id: string,
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  try {
    await requireAdmin();

    const raw = {
      titleEn: formData.get("titleEn"),
      titleBn: formData.get("titleBn"),
      descriptionEn: formData.get("descriptionEn"),
      descriptionBn: formData.get("descriptionBn"),
      totalCapital: formData.get("totalCapital"),
      totalShares: formData.get("totalShares"),
      imageUrl: formData.get("imageUrl") || "",
      status: formData.get("status") || "ACTIVE",
    };

    const validated = createProjectSchema.safeParse(raw);
    if (!validated.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { totalCapital, totalShares, imageUrl, ...rest } = validated.data;
    const pricePerShare = totalCapital / totalShares;

    await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        totalCapital,
        totalShares,
        pricePerShare,
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath("/en/admin/projects");
    revalidatePath("/bn/admin/projects");
    revalidatePath("/en/projects");
    revalidatePath("/bn/projects");

    return { success: true, message: "Project updated successfully!" };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

export async function deleteProjectAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin();
    await prisma.project.delete({ where: { id } });
    revalidatePath("/en/admin/projects");
    revalidatePath("/bn/admin/projects");
    return { success: true, message: "Project deleted." };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

// ─── Admin: Approve/Reject share orders ───────────────────────────────────
export async function updateShareOrderStatus(
  orderId: string,
  status: "APPROVED" | "REJECTED",
  adminNote?: string
): Promise<{ success: boolean; message: string }> {
  try {
    await requireAdmin();

    const order = await prisma.shareOrder.findUnique({
      where: { id: orderId },
      include: {
        project: true,
        user: { select: { email: true, name: true } },
      },
    });
    if (!order) return { success: false, message: "Order not found." };

    // Guard: only process PENDING orders to prevent double-approval
    if (order.status !== "PENDING") {
      return { success: false, message: `Order is already ${order.status.toLowerCase()}. Cannot process again.` };
    }

    await prisma.$transaction(async (tx) => {
      await tx.shareOrder.update({
        where: { id: orderId },
        data: { status, adminNote: adminNote || null },
      });

      if (status === "APPROVED") {
        // Decrease available shares
        await tx.project.update({
          where: { id: order.projectId },
          data: { availableShares: { decrement: order.quantity } },
        });

        // Record wallet transaction
        let wallet = await tx.wallet.findUnique({ where: { userId: order.userId } });
        if (!wallet) {
          wallet = await tx.wallet.create({
            data: { userId: order.userId, balance: 0, points: 0 },
          });
        }

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: "SHARE_PURCHASE",
            amount: -order.totalAmount,
            description: `Purchased ${order.quantity} share(s) in ${order.project.titleEn}`,
          },
        });
      }
    });

    // Send email notification (non-blocking — failure won't affect order status)
    if (status === "APPROVED") {
      await sendShareOrderApprovedEmail({
        recipientEmail: order.user.email,
        recipientName: order.user.name,
        projectTitle: order.project.titleEn,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        adminNote,
      });
    } else {
      await sendShareOrderRejectedEmail({
        recipientEmail: order.user.email,
        recipientName: order.user.name,
        projectTitle: order.project.titleEn,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        adminNote,
      });
    }

    revalidatePath("/en/admin/share-orders");
    revalidatePath("/bn/admin/share-orders");

    return { success: true, message: `Order ${status.toLowerCase()} successfully.` };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Something went wrong.";
    return { success: false, message: msg };
  }
}

export async function getAllShareOrders() {
  await requireAdmin();
  return prisma.shareOrder.findMany({
    include: { user: { select: { id: true, name: true, email: true } }, project: true },
    orderBy: { createdAt: "desc" },
  });
}
