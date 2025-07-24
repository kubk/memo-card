import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import Link from "next/link";
import React from "react";
import { formatLandingLanguage, LandingLanguage, landingLanguages } from "api";

export function LanguageSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Globe />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {landingLanguages.map((language, i) => (
          <DropdownMenuItem className={"py-4 px-6 text-lg"} asChild key={i}>
            <Link href={`/${language === LandingLanguage.en ? "" : language}`}>
              {formatLandingLanguage(language)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
