"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { applyForTrainingSchema } from "@/lib/schemas";
import { FormState } from "./member.actions"; // Re-using the same state type

const prisma = new PrismaClient();

export async function applyForTrainingAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot field for spam protection
  if (formData.get("honeypot")) {
    return { success: false, message: "Spam detected." };
  }

  const validatedFields = applyForTrainingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    courseId: formData.get("courseId"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, courseId } = validatedFields.data;

  try {
    // Find or create a user with the provided email
    // In a real-world scenario, you might want to link this to a logged-in user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { name, email },
      });
    }

    // Check if the user has already applied for this course
    const existingApplication = await prisma.courseApplication.findFirst({
      where: { userId: user.id, courseId },
    });

    if (existingApplication) {
      return { success: false, message: "You have already applied for this course." };
    }

    // Create the course application
    await prisma.courseApplication.create({
      data: {
        userId: user.id,
        courseId,
      },
    });

    return { success: true, message: "Application submitted successfully! We will be in touch shortly." };
  } catch (error) {
    console.error("Error creating application:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
