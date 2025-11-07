import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...(titleEn !== undefined ? { titleEn: String(titleEn) } : {}),
        ...(titleBn !== undefined ? { titleBn: String(titleBn) } : {}),
        ...(descriptionEn !== undefined ? { descriptionEn: String(descriptionEn) } : {}),
        ...(descriptionBn !== undefined ? { descriptionBn: String(descriptionBn) } : {}),
        ...(fee !== undefined ? { fee: parseFloat(String(fee)) } : {}),
        ...(startDate !== undefined ? { startDate: new Date(String(startDate)) } : {}),
        ...(endDate !== undefined ? { endDate: new Date(String(endDate)) } : {}),
      }
    });

    revalidatePath("/admin/courses");
    return NextResponse.json({ success: true, course });
  } catch (e) {
    console.error("Failed to update course", e);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.course.delete({ where: { id: params.id } });
    revalidatePath("/admin/courses");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to delete course", e);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
