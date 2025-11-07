"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Building, 
  TrendingUp, 
  FileText, 
  Settings,
  LogOut,
  ChevronRight,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  locale: string;
}

export default function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("AdminSidebar");

  const menuItems = [
    {
      title: "Dashboard",
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
      exact: true
    },
    {
      title: "Members",
      href: `/${locale}/admin/members`,
      icon: Users
    },
    {
      title: "Courses",
      href: `/${locale}/admin/courses`,
      icon: BookOpen
    },
    {
      title: "Ventures",
      href: `/${locale}/admin/ventures`,
      icon: TrendingUp
    },
    {
      title: "Brands",
      href: `/${locale}/admin/brands`,
      icon: Building
    },
    {
      title: "Stories",
      href: `/${locale}/admin/stories`,
      icon: FileText
    },
    {
      title: "Settings",
      href: `/${locale}/admin/settings`,
      icon: Settings
    }
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">BB</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">Management Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} />
                <span className="flex-1">{item.title}</span>
                {active && <ChevronRight className="h-4 w-4 text-white" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href={`/${locale}/`}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Home className="h-5 w-5 text-gray-400" />
          <span>Back to Site</span>
        </Link>
        
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: `/${locale}/` })}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}