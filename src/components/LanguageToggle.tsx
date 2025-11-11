"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    // Extract the current path without the locale
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    
    // Navigate to the new locale path and force refresh
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    window.location.href = newPath;
  };

  // Get current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-2 hover:bg-secondary hover:text-foreground transition-colors relative z-50"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">
            {currentLocale === 'bn' ? 'বাং' : 'EN'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 z-[60] bg-background border border-border shadow-lg">
        <DropdownMenuItem 
          onClick={() => switchLanguage('en')}
          className={`cursor-pointer hover:bg-secondary ${currentLocale === 'en' ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <span className="flex items-center space-x-2">
            {/* US Flag Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
              <mask id="a"><circle cx="256" cy="256" r="256" fill="#fff"/></mask>
              <g mask="url(#a)">
                <path fill="#eee" d="M0 0h512v512H0z"/>
                <path fill="#d80027" d="M0 0h512v256H0z"/>
                <path fill="#0052b4" d="M192 192h128v128H192z"/>
              </g>
            </svg>
            <span>English</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => switchLanguage('bn')}
          className={`cursor-pointer hover:bg-secondary ${currentLocale === 'bn' ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <span className="flex items-center space-x-2">
            {/* Bangladesh Flag Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
              <mask id="a"><circle cx="256" cy="256" r="256" fill="#fff"/></mask>
              <g mask="url(#a)">
                <path fill="#496e2d" d="M0 0h512v512H0z"/>
                <circle cx="224" cy="256" r="96" fill="#d80027"/>
              </g>
            </svg>
            <span>বাংলা</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}