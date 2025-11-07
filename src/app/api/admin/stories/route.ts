import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
    }

    const { slug, titleEn, titleBn, bodyEn, bodyBn } = body;

    if (!slug || !titleEn || !titleBn || !bodyEn || !bodyBn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const story = await prisma.story.create({
      data: {
        slug: String(slug),
        titleEn: String(titleEn),
        titleBn: String(titleBn),
        bodyEn: String(bodyEn),
        bodyBn: String(bodyBn),
        authorId: session.user.id as string,
      }
    });

    revalidatePath("/admin/stories");
    return NextResponse.json({ success: true, story });
  } catch (e) {
    console.error("Failed to create story", e);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
