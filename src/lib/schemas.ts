// src/lib/schemas.ts
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

// Schema for the "Join as Member" form (KYC)
export const joinMemberSchema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
    nationalId: z.string().min(10, { message: "National ID or Passport must be at least 10 characters long." }),
    phone: z.string().regex(/^01[3-9]\d{8}$/, { message: "Please enter a valid Bangladeshi phone number." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    address: z.string().min(10, { message: "Address must be at least 10 characters long." }),
    nomineeName: z.string().min(3, { message: "Nominee name must be at least 3 characters long." }),
    nomineePhone: z.string().regex(/^01[3-9]\d{8}$/, { message: "Please enter a valid Bangladeshi phone number for nominee." }),
    nomineeNationalId: z.string().min(10, { message: "Nominee National ID must be at least 10 characters long." }),
    nomineeRelation: z.string().min(2, { message: "Please specify relation with the nominee." }),
    policyConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions.",
    }),
  })
  .refine((data) => data.phone !== data.nomineePhone, {
    message: "Validation.nomineePhoneNotSame",
    path: ["nomineePhone"],
  });

// Schema for the "Apply for Training" form
export const applyForTrainingSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^01[3-9]\d{8}$/, { message: "Please enter a valid Bangladeshi phone number." }),
  courseId: z.string().cuid({ message: "Please select a valid course." }),
});

// Schema for the "Propose a Venture" form
export const proposeVentureSchema = z.object({
  titleEn: z.string().min(5, { message: "English title must be at least 5 characters long." }),
  titleBn: z.string().min(5, { message: "Bengali title must be at least 5 characters long." }),
  descriptionEn: z.string().min(20, { message: "English description must be at least 20 characters long." }),
  descriptionBn: z.string().min(20, { message: "Bengali description must be at least 20 characters long." }),
  budget: z.number().positive({ message: "Budget must be a positive number." }),
  leanCanvas: z
    .any()
    .optional()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_FILE_TYPES.includes(file?.type),
      ".pdf, .jpg, and .png files are accepted."
    ),
});

// Schema for the "Partner Inquiry" form
export const partnerInquirySchema = z.object({
    organizationName: z.string().min(3, { message: "Organization name must be at least 3 characters long." }),
    contactPerson: z.string().min(3, { message: "Contact person must be at least 3 characters long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().optional(),
    message: z.string().min(20, { message: "Message must be at least 20 characters long." }),
});
