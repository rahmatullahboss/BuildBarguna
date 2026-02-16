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

  // Debug the form data
    console.log("Form data received:", {
    name: formData.get("name"),
    nationalId: formData.get("nationalId"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    nomineeName: formData.get("nomineeName"),
    nomineePhone: formData.get("nomineePhone"),
    nomineeNationalId: formData.get("nomineeNationalId"),
    nomineeRelation: formData.get("nomineeRelation"),
    bkashNumber: formData.get("bkashNumber"),
    transactionId: formData.get("transactionId"),
    policyConsent: formData.get("policyConsent"),
  });

  const validatedFields = joinMemberSchema.safeParse({
    name: formData.get("name"),
    nationalId: formData.get("nationalId"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    nomineeName: formData.get("nomineeName"),
    nomineePhone: formData.get("nomineePhone"),
    nomineeNationalId: formData.get("nomineeNationalId"),
    nomineeRelation: formData.get("nomineeRelation"),
    bkashNumber: formData.get("bkashNumber"),
    transactionId: formData.get("transactionId"),
    policyConsent: formData.get("policyConsent") === "on" || formData.get("policyConsent") === "true",
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    console.log("Validation errors:", validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, nationalId, phone, address, nomineeName, nomineePhone, nomineeNationalId, nomineeRelation, bkashNumber, transactionId, policyConsent, password } = validatedFields.data;

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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user and member profile in a transaction
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "MEMBER",
        memberProfile: {
          create: {
            nationalId,
            phone,
            address,
            nomineeName: nomineeName || null,
            nomineePhone: nomineePhone || null,
            nomineeNationalId: nomineeNationalId || null,
            nomineeRelation: nomineeRelation || null,
            bkashNumber,
            transactionId,
            policyConsent,
            isApproved: false, // Members require admin approval
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
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
                <p><strong>National ID:</strong> ${nationalId}</p>
                <p><strong>Address:</strong> ${address}</p>
                <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0;">
                  <h3 style="margin-top: 0; color: #007bff;">Payment Details</h3>
                  <p><strong>bKash Number:</strong> ${bkashNumber}</p>
                  <p><strong>Transaction ID:</strong> ${transactionId}</p>
                </div>
                ${nomineeName ? `
                  <p><strong>Nominee:</strong> ${nomineeName} ${nomineeRelation ? `(${nomineeRelation})` : ''}</p>
                  ${nomineePhone ? `<p><strong>Nominee Phone:</strong> ${nomineePhone}</p>` : ''}
                  ${nomineeNationalId ? `<p><strong>Nominee NID:</strong> ${nomineeNationalId}</p>` : ''}
                ` : ''}
                <p><strong>Policy Consent:</strong> ${policyConsent ? 'Yes' : 'No'}</p>
              </div>
              <div style="margin: 30px 0; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong>Quick Reply:</strong>
                  <a href="mailto:${email}?subject=Your membership application&body=Hello ${name},%0D%0A%0D%0AThank you for applying for founding membership. We have received your payment details (TrxID: ${transactionId}). Our team will review your application and get back to you within 3-7 working days.%0D%0A%0D%0A" style="color: #007bff; text-decoration: none;">Click here to reply</a>
                </p>
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
