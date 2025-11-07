import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ metric: string }> }) {
  const { metric } = await params;
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
    }

    const { value, labelEn, labelBn } = body as any;

    const kpi = await prisma.kPI.upsert({
      where: { metric },
      create: {
        metric,
        value: value !== undefined ? parseFloat(String(value)) : 0,
        labelEn: labelEn ?? metric,
        labelBn: labelBn ?? metric,
      },
      update: {
        ...(value !== undefined ? { value: parseFloat(String(value)) } : {}),
        ...(labelEn !== undefined ? { labelEn: String(labelEn) } : {}),
        ...(labelBn !== undefined ? { labelBn: String(labelBn) } : {}),
      },
    });

    revalidatePath("/admin/settings");
    return NextResponse.json({ success: true, kpi });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update KPI" }, { status: 500 });
  }
}
