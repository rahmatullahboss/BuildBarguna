// src/app/[locale]/admin/page.tsx
import { auth } from "@/auth";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800">Welcome to the Admin Dashboard</h1>
      <p className="mt-2 text-lg text-stone-600">
        Hello, <span className="font-semibold">{session?.user?.name || "Admin"}</span>!
      </p>
      <div className="mt-8">
        <p>This is where you can manage the content and operations of the Build Barguna Co-operative website. Use the sidebar to navigate to different sections.</p>
        {/* KPI charts and summaries will be added here */}
      </div>
    </div>
  );
}
