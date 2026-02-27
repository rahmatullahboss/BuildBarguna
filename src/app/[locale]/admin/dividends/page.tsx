import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAllDividends } from "@/lib/actions/wallet.actions";
import { DividendsManager } from "./_components/DividendsManager";

export default async function AdminDividendsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/en/auth/signin");

  const [dividends, projects] = await Promise.all([
    getAllDividends(),
    prisma.project.findMany({ select: { id: true, titleEn: true, titleBn: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Monthly Dividends</h1>
        <p className="text-muted-foreground">Create and distribute monthly dividends to shareholders</p>
      </div>
      <DividendsManager dividends={dividends} projects={projects} />
    </div>
  );
}
