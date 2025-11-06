// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
// import LanguageSwitcher from "../LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const navItems = ["home", "about", "programs", "brands", "members", "governance", "stories", "partners", "contact"];
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
      <nav className="container flex items-center justify-between py-4 mx-auto">
        <Link href="/" className="text-2xl font-bold text-stone-800" onClick={() => setSheetOpen(false)}>
          Build Barguna
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <li key={item}>
              <Link
                href={`/${item === "home" ? "" : item}`}
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                {t(item)}
              </Link>
            </li>
          ))}
        </ul>

        {/* <LanguageSwitcher /> */}

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <ul className="mt-8 space-y-4">
                {navItems.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item === "home" ? "" : item}`}
                      className="text-lg text-stone-700 hover:text-stone-900 transition-colors"
                      onClick={() => setSheetOpen(false)} // Close sheet on link click
                    >
                      {t(item)}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
