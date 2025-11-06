"use server";

import { PrismaClient } from "@prisma/client";
import { joinMemberSchema } from "@/lib/schemas";

const prisma = new PrismaClient();

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function joinMemberAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot field for spam protection
  if (formData.get("honeypot")) {
    return { success: false, message: "Spam detected." };
  }

  const validatedFields = joinMemberSchema.safeParse({
    name: formData.get("name"),
    nationalId: formData.get("nationalId"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    policyConsent: formData.get("policyConsent") === "on",
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, nationalId, phone, address, policyConsent } = validatedFields.data;

  try {
    // Check if a user with this email or NID already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { memberProfile: { nationalId } },
        ],
      },
    });

    if (existingUser) {
      return { success: false, message: "A user with this email or National ID already exists." };
    }

    // Create the new user and member profile in a transaction
    await prisma.user.create({
      data: {
        name,
        email,
        role: "MEMBER",
        memberProfile: {
          create: {
            nationalId,
            phone,
            address,
            policyConsent,
            isApproved: false, // Members require admin approval
          },
        },
      },
    });

    // In a real app, you would also trigger a confirmation email here
    // await sendConfirmationEmail(email);

    return { success: true, message: "Application submitted successfully! You will be contacted after review." };
  } catch (error) {
    console.error("Error creating member:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
