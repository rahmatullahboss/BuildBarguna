import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const kpis = await prisma.kPI.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json({ kpis });
  } catch (e) {
    return NextResponse.json({ kpis: [] });
  }
}
