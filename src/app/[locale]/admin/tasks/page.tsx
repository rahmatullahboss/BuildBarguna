import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllTasksAdmin } from "@/lib/actions/task.actions";
import { TasksAdminTable } from "./_components/TasksAdminTable";

export default async function AdminTasksPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/en/auth/signin");

  const tasks = await getAllTasksAdmin();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Daily Tasks</h1>
        <p className="text-muted-foreground">Manage social media tasks for members</p>
      </div>
      <TasksAdminTable tasks={tasks} />
    </div>
  );
}
