import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectsAdminTable } from "./_components/ProjectsAdminTable";

export default async function AdminProjectsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/en/auth/signin");

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { shareOrders: true } } },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Live Projects</h1>
        <p className="text-muted-foreground">Manage share market projects</p>
      </div>
      <ProjectsAdminTable projects={projects} />
    </div>
  );
}
