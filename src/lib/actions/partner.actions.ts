"use server";

import { z } from "zod";
import { partnerInquirySchema } from "@/lib/schemas";
import { FormState } from "./member.actions";

// In a real application, you would import PrismaClient and save the inquiry
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

export async function partnerInquiryAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Honeypot field for spam protection
  if (formData.get("honeypot")) {
    return { success: false, message: "Spam detected." };
  }

  const validatedFields = partnerInquirySchema.safeParse({
    organizationName: formData.get("organizationName"),
    contactPerson: formData.get("contactPerson"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { organizationName, contactPerson, email, phone, message } = validatedFields.data;

  try {
    // Here you would typically:
    // 1. Save the inquiry to the database
    // await prisma.partnerInquiry.create({ data: validatedFields.data });

    // 2. Send an email notification to the admin team
    // await sendAdminNotificationEmail({ ... });

    console.log("New Partner Inquiry:", validatedFields.data);

    return { success: true, message: "Your inquiry has been submitted successfully! We will get back to you shortly." };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
