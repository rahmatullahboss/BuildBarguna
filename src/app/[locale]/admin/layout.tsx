// src/app/[locale]/admin/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// Match the exact pattern used in the working layout.tsx file
type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function AdminLayout({ children, params: { locale } }: Props) {
  const session = await auth();

  // Protect all routes in the admin group
  if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "EDITOR")) {
    redirect(`/${locale}/`); // Redirect to homepage if not authorized
  }

  return (
    <div className="flex h-screen bg-stone-100">
      {/* <AdminSidebar /> */}
      <aside className="w-64 bg-white border-r border-stone-200 p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <Link href={`/${locale}/admin`} className="block p-2 rounded-md hover:bg-stone-100">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/admin/courses`} className="block p-2 rounded-md hover:bg-stone-100">
                Courses
              </Link>
            </li>
            {/* More links will be added here */}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}