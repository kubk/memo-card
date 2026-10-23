import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatLandingLanguage, LandingLanguage, landingLanguages } from "api";

const languagePaths = {
  [LandingLanguage.en]: "/",
  [LandingLanguage.ru]: "/ru",
  [LandingLanguage.es]: "/es",
  [LandingLanguage.ptBr]: "/pt-br",
  [LandingLanguage.uk]: "/uk",
} as const satisfies Record<LandingLanguage, string>;

export function LanguageSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Globe />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {landingLanguages.map((language, i) => (
          <DropdownMenuItem className={"py-4 px-6 text-lg"} asChild key={i}>
            <Link to={languagePaths[language]}>
              {formatLandingLanguage(language)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
