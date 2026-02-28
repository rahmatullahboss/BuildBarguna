"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Menu, X, User, TrendingUp, Wallet, CheckSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/programs`, label: t("programs") },
    { href: `/${locale}/brands`, label: t("brands") },
    { href: `/${locale}/nitimala`, label: t("governance") },
    { href: `/${locale}/stories`, label: t("stories") },
    { href: `/${locale}/partners`, label: t("partners") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-gray-200 dark:bg-black/80 dark:border-gray-800" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold text-xl group-hover:scale-105 transition-transform duration-300">
              B
            </div>
            <span className={cn(
              "font-bold text-xl tracking-tight transition-colors duration-300",
              isScrolled ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"
            )}>
              Build Barguna
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-black dark:hover:text-white relative group",
                  isActive(link.href) ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-300"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-full h-0.5 bg-black dark:bg-white transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                  isActive(link.href) && "scale-x-100"
                )} />
              </Link>
            ))}

            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              
              {session ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/dashboard`}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/projects`} className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        {t("projects")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/wallet`} className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        {t("wallet")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/daily-tasks`} className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        {t("dailyTasks")}
                      </Link>
                    </DropdownMenuItem>
                    {session.user?.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                     <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href={`/${locale}/auth/signin`}>
                    <Button variant="ghost" size="sm" className="hidden lg:inline-flex dark:text-white">
                      Log In
                    </Button>
                  </Link>
                  <Link href={`/${locale}/join-member`}>
                    <Button size="sm" className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white rounded-full px-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute top-20 left-0 w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 shadow-lg transition-all duration-300 origin-top overflow-hidden",
        mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block text-lg font-medium transition-colors hover:text-black dark:hover:text-white",
                isActive(link.href) ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-300"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
             {session ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-sm text-gray-500">{session.user?.email}</p>
                  </div>
                </div>
                <Link href={`/${locale}/dashboard`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <Link href={`/${locale}/projects`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t("projects")}
                  </Button>
                </Link>
                <Link href={`/${locale}/wallet`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Wallet className="h-4 w-4" />
                    {t("wallet")}
                  </Button>
                </Link>
                <Link href={`/${locale}/daily-tasks`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CheckSquare className="h-4 w-4" />
                    {t("dailyTasks")}
                  </Button>
                </Link>
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => signOut()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                 <Link href={`/${locale}/auth/signin`} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start dark:text-white">
                    Log In
                  </Button>
                </Link>
                <Link href={`/${locale}/join-member`} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white rounded-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}