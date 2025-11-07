import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
    }

    const { titleEn, titleBn, bodyEn, bodyBn, published } = body as any;

    const story = await prisma.story.update({
      where: { id },
      data: {
        ...(titleEn !== undefined ? { titleEn: String(titleEn) } : {}),
        ...(titleBn !== undefined ? { titleBn: String(titleBn) } : {}),
        ...(bodyEn !== undefined ? { bodyEn: String(bodyEn) } : {}),
        ...(bodyBn !== undefined ? { bodyBn: String(bodyBn) } : {}),
        ...(published !== undefined ? { publishedAt: published ? new Date() : null } : {}),
      }
    });

    revalidatePath("/admin/stories");
    return NextResponse.json({ success: true, story });
  } catch (e) {
    console.error("Failed to update story", e);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.story.delete({ where: { id } });
    revalidatePath("/admin/stories");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to delete story", e);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
