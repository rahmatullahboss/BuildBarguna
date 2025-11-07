"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize from localStorage or system preference
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored ? stored === "dark" : prefersDark;
    
    console.log("Theme init:", { stored, prefersDark, initialDark });
    
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
    
    // Force styles update
    document.body.style.backgroundColor = initialDark ? 'var(--background)' : 'white';
    document.body.style.color = initialDark ? 'var(--foreground)' : 'black';
  }, []);

  const toggle = () => {
    const next = !isDark;
    console.log("Toggling theme:", { from: isDark, to: next });
    
    setIsDark(next);
    
    if (next) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
      localStorage.setItem("theme", "light");
    }
    
    console.log("HTML classes after toggle:", document.documentElement.className);
  };

  if (!mounted) {
    return <Button variant="ghost" size="sm" className="p-2 opacity-50">
      <Moon className="h-5 w-5" />
    </Button>;
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme" className="p-2">
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
