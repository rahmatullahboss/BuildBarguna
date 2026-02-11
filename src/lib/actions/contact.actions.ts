"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export interface ContactFormState {
  success?: boolean;
  message?: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    phone?: string[];
    subject?: string[];
    message?: string[];
  };
}

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  try {
    // Validate form data
    const validatedFields = contactSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { firstName, lastName, email, phone, subject, message } = validatedFields.data;

    // Save to database
    await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        subject,
        message,
        status: "unread",
      },
    });

    // Send email notification
    try {
      await sendEmailNotification({
        firstName,
        lastName,
        email,
        phone,
        subject,
        message,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Continue even if email fails - message is still saved
    }

    revalidatePath("/admin/contacts");

    return {
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

async function sendEmailNotification({
  firstName,
  lastName,
  email,
  phone,
  subject,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Skipping email send.");
      return;
    }
    await resend.emails.send({
      from: 'Build Barguna <onboarding@resend.dev>',
      to: 'rahmatullahzisan@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555;">Contact Details</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555;">Message</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
              <p style="white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
          </div>
          
          <div style="margin: 30px 0; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Quick Reply:</strong> 
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}&body=Hello ${firstName},%0D%0A%0D%0AThank you for contacting Build Barguna Initiative.%0D%0A%0D%0A" 
                 style="color: #007bff; text-decoration: none;">Click here to reply directly</a>
            </p>
          </div>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #888; text-align: center;">
            Sent from Build Barguna Initiative Contact Form<br>
            <em>Received at ${new Date().toLocaleString()}</em>
          </p>
        </div>
      `,
    });
    
    console.log("Email notification sent successfully to rahmatullahzisan@gmail.com");
  } catch (error) {
    console.error("Failed to send email notification:", error);
    throw error;
  }
}

// Admin functions
export async function getContacts() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return contacts;
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return [];
  }
}

export async function markContactAsRead(contactId: string): Promise<void> {
  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: { status: "read" },
    });
  } catch (error) {
    console.error("Failed to mark contact as read:", error);
  }
}

export async function deleteContact(contactId: string): Promise<void> {
  try {
    await prisma.contact.delete({
      where: { id: contactId },
    });
  } catch (error) {
    console.error("Failed to delete contact:", error);
  }
}