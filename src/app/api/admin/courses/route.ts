import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
    }

    const { titleEn, titleBn, descriptionEn, descriptionBn, fee, startDate, endDate } = body;

    if (!titleEn || !titleBn || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        titleEn: String(titleEn),
        titleBn: String(titleBn),
        descriptionEn: String(descriptionEn || ""),
        descriptionBn: String(descriptionBn || ""),
        fee: fee ? parseFloat(String(fee)) : 0,
        isScholarshipAvailable: false,
        startDate: new Date(String(startDate)),
        endDate: new Date(String(endDate)),
      }
    });

    revalidatePath("/admin/courses");
    return NextResponse.json({ success: true, course });
  } catch (e) {
    console.error("Failed to create course", e);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
