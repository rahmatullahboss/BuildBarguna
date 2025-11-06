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
    
    // Navigate to the new locale path
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  // Get current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-600 transition-colors relative z-50"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">
            {currentLocale === 'bn' ? 'বাং' : 'EN'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 z-[60] bg-white border border-gray-200 shadow-lg">
        <DropdownMenuItem 
          onClick={() => switchLanguage('en')}
          className={`cursor-pointer hover:bg-gray-100 ${currentLocale === 'en' ? 'bg-blue-50 text-blue-600' : ''}`}
        >
          <span className="flex items-center space-x-2">
            <span className="text-lg">🇺🇸</span>
            <span>English</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => switchLanguage('bn')}
          className={`cursor-pointer hover:bg-gray-100 ${currentLocale === 'bn' ? 'bg-blue-50 text-blue-600' : ''}`}
        >
          <span className="flex items-center space-x-2">
            <span className="text-lg">🇧🇩</span>
            <span>বাংলা</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}