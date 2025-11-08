// src/app/[locale]/admin/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Match the exact pattern used in the working layout.tsx file
type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function AdminLayout({ children, params }: Props) {
  // Handle both Promise and resolved params
  const resolvedParams = await Promise.resolve(params);
  const { locale } = resolvedParams;
  const session = await auth();

  // Protect all routes in the admin group  
  if (!session || !session.user) {
    redirect(`/${locale}/auth/signin`); // Redirect to signin if not authenticated
  }
  
  // Check if user has admin role (case insensitive)
  const userRole = session.user?.role?.toLowerCase();
  if (userRole !== "admin" && userRole !== "editor") {
    redirect(`/${locale}/`); // Redirect to homepage if not authorized
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar locale={locale} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}