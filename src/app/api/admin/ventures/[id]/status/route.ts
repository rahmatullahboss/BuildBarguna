import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Support both JSON and form submissions
  let body: any = {};
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    body = await req.json();
  } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    body = Object.fromEntries(form.entries());
  }

  try {
    const { status } = body as { status?: string };
    const allowed = ["proposed", "approved", "rejected", "active"];
    const normalized = String(status || "").toLowerCase();
    if (!allowed.includes(normalized)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await prisma.venture.update({
      where: { id },
      data: { status: normalized },
    });

    revalidatePath("/admin/ventures");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to update venture status", e);
    return NextResponse.json({ error: "Failed to update venture status" }, { status: 500 });
  }
}
