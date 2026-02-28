"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { joinMemberSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY || "");

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
    phone: formData.get("phone"),
    referralCode: formData.get("referralCode"),
    policyConsent: formData.get("policyConsent") === "on" || formData.get("policyConsent") === "true",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, phone, referralCode, policyConsent, password } = validatedFields.data;

  try {
    // Generate a unique email from phone number
    const userEmail = `${phone}@member.buildbarguna.org`;

    // Check if a user with this phone already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: userEmail },
    });

    if (existingUser) {
      return { success: false, message: "A user with this phone number already exists." };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user and member profile
    await prisma.user.create({
      data: {
        name,
        email: userEmail,
        password: hashedPassword,
        role: "MEMBER",
        memberProfile: {
          create: {
            phone,
            referralCode: referralCode || null,
            policyConsent,
            isApproved: false,
          },
        },
      },
    });

    // Notify admin via email
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Skipping membership email send.");
      } else {
        await resend.emails.send({
          from: 'Build Barguna <onboarding@resend.dev>',
          to: 'rahmatullahzisan@gmail.com',
          subject: `New Membership Application: ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Founding Membership Request</h2>
              <div style="margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                <p><strong>Policy Consent:</strong> ${policyConsent ? 'Yes' : 'No'}</p>
              </div>
            </div>
          `,
        });
      }
    } catch (e) {
      console.error("Failed to send membership notification email:", e);
    }

    return { success: true, message: "Application submitted successfully! You will be contacted after review." };
  } catch (error) {
    console.error("Error creating member:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
