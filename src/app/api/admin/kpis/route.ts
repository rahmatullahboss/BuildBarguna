import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const kpis = await prisma.kPI.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json({ kpis });
  } catch {
    return NextResponse.json({ kpis: [] });
  }
}
