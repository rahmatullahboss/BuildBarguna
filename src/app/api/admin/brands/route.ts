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

    const { slug, nameEn, nameBn, descriptionEn, descriptionBn, logoUrl } = body;

    if (!slug || !nameEn || !nameBn || !descriptionEn || !descriptionBn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: {
        slug: String(slug),
        nameEn: String(nameEn),
        nameBn: String(nameBn),
        descriptionEn: String(descriptionEn),
        descriptionBn: String(descriptionBn),
        logoUrl: logoUrl ? String(logoUrl) : null,
        galleryUrls: [],
      }
    });

    revalidatePath("/admin/brands");
    return NextResponse.json({ success: true, brand });
  } catch (e) {
    console.error("Failed to create brand", e);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
