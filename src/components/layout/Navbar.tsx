"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Settings } from "lucide-react";
import { Button } from "../ui/button";
import LanguageToggle from "../LanguageToggle";
import DarkModeToggle from "@/components/DarkModeToggle";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  
  // Get current locale
  const currentLocale = pathname.split('/')[1] || 'en';
  
  // Debug session in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Navbar session:", session);
      console.log("User role:", session?.user?.role);
    }
  }, [session]);

  const navItems = [
    { key: "home", href: `/${currentLocale}` },
    { key: "about", href: `/${currentLocale}/about` },
    { key: "programs", href: `/${currentLocale}/programs` },
    { key: "brands", href: `/${currentLocale}/brands` },
    { key: "members", href: `/${currentLocale}/join-member` },
    { key: "governance", href: `/${currentLocale}/nitimala` },
    { key: "stories", href: `/${currentLocale}/stories` },
    { key: "partners", href: `/${currentLocale}/partners` },
    { key: "contact", href: `/${currentLocale}/contact` }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "/en" || pathname === "/bn";
    }
    return pathname.includes(href);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-lg shadow-lg border-b border-border" 
          : "bg-background/80 backdrop-blur-md"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          {/* Logo */}
          <Link 
            href={`/${pathname.split('/')[1] || 'en'}`}
            className="flex items-center space-x-2 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 bg-black-primary rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">BB</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Build Barguna
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-secondary hover:text-foreground ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Right side - Admin Link + Language Toggle + Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Admin Link removed per request */}
            
            {/* Debug info - Remove in production */}
            {process.env.NODE_ENV === "development" && session && (
              <div className="hidden lg:block text-xs text-red-500">
                {session.user?.email}:{session.user?.role}
              </div>
            )}
            
            <DarkModeToggle />
            <LanguageToggle />
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg transition-all duration-300 ease-in-out z-50 ${
            isOpen 
              ? "max-h-screen opacity-100" 
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            
            {/* Admin Link removed per request (mobile) */}
            
            {/* Debug info for mobile */}
            {process.env.NODE_ENV === "development" && session && (
              <div className="px-4 py-2 text-xs text-red-500">
                Session: {session.user?.email}:{session.user?.role}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
