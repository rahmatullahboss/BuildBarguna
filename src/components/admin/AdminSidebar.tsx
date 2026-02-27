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
  Home,
  Mail,
  Briefcase,
  ShoppingCart,
  Coins,
  CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/DarkModeToggle";

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
      title: "Contacts",
      href: `/${locale}/admin/contacts`,
      icon: Mail
    },
    {
      title: "Live Projects",
      href: `/${locale}/admin/projects`,
      icon: Briefcase
    },
    {
      title: "Share Orders",
      href: `/${locale}/admin/share-orders`,
      icon: ShoppingCart
    },
    {
      title: "Dividends",
      href: `/${locale}/admin/dividends`,
      icon: Coins
    },
    {
      title: "Daily Tasks",
      href: `/${locale}/admin/tasks`,
      icon: CheckSquare
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
    <aside className="w-64 bg-background border-r border-border shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">BB</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Management Dashboard</p>
            </div>
          </div>
          <DarkModeToggle />
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
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                <span className="flex-1">{item.title}</span>
                {active && <ChevronRight className="h-4 w-4 text-primary-foreground" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          href={`/${locale}/`}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5 text-muted-foreground" />
          <span>Back to Site</span>
        </Link>
        
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: `/${locale}/` })}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}