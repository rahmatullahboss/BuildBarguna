"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { proposeVentureSchema } from "@/lib/schemas";
import { FormState } from "./member.actions";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function proposeVentureAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();

  // 1. Authentication and Authorization Check
  if (!session || session.user?.role !== "MEMBER") {
    return { success: false, message: "You must be a logged-in member to perform this action." };
  }

  const validatedFields = proposeVentureSchema.safeParse({
    titleEn: formData.get("titleEn"),
    titleBn: formData.get("titleBn"),
    descriptionEn: formData.get("descriptionEn"),
    descriptionBn: formData.get("descriptionBn"),
    budget: formData.get("budget"),
    leanCanvas: formData.get("leanCanvas"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { titleEn, titleBn, descriptionEn, descriptionBn, budget, leanCanvas } = validatedFields.data;
  const proposerId = session.user.id!;

  try {
    // 2. Upload file to Vercel Blob
    const blob = await put(leanCanvas.name, leanCanvas, {
      access: "public",
    });

    // 3. Create venture in the database
    await prisma.venture.create({
      data: {
        proposerId,
        titleEn,
        titleBn,
        descriptionEn,
        descriptionBn,
        budget,
        leanCanvasUrl: blob.url,
        status: "PROPOSED",
      },
    });

  } catch (error) {
    console.error("Error proposing venture:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }

  // 4. Redirect on success
  redirect("/en/programs?status=success");
}
