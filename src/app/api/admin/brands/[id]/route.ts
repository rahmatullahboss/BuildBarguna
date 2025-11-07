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

    const { nameEn, nameBn, descriptionEn, descriptionBn, logoUrl } = body;

    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: {
        ...(nameEn !== undefined ? { nameEn: String(nameEn) } : {}),
        ...(nameBn !== undefined ? { nameBn: String(nameBn) } : {}),
        ...(descriptionEn !== undefined ? { descriptionEn: String(descriptionEn) } : {}),
        ...(descriptionBn !== undefined ? { descriptionBn: String(descriptionBn) } : {}),
        ...(logoUrl !== undefined ? { logoUrl: String(logoUrl) } : {}),
      }
    });

    revalidatePath("/admin/brands");
    return NextResponse.json({ success: true, brand });
  } catch (e) {
    console.error("Failed to update brand", e);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.brand.delete({ where: { id: params.id } });
    revalidatePath("/admin/brands");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to delete brand", e);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
