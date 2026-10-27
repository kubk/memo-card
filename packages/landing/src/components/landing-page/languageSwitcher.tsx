import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatLandingLanguage, landingLanguages } from "api";
import { getLandingPath, type LandingPage } from "@/shared/landingPaths";

export function LanguageSwitcher({ page }: { page: LandingPage }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Globe />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {landingLanguages.map((language, i) => (
          <DropdownMenuItem className={"py-4 px-6 text-lg"} asChild key={i}>
            <Link to={getLandingPath(language, page)}>
              {formatLandingLanguage(language)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
