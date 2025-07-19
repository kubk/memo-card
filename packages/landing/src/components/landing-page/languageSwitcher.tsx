import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import {
  formatLanguageEnum,
  LanguageEnum,
  languages,
} from "@/shared/translations";
import Link from "next/link";
import React from "react";

export function LanguageSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Globe />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((language, i) => (
          <DropdownMenuItem className={"py-4 px-6 text-lg"} asChild key={i}>
            <Link href={`/${language === LanguageEnum.en ? "" : language}`}>
              {formatLanguageEnum(language)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
