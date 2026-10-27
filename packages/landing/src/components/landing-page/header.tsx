import { LandingLanguage, links } from "api";
import { getLandingPath, type LandingPage } from "@/shared/landingPaths";
import { LanguageSwitcher } from "./languageSwitcher";

export function Header({
  language,
  page,
}: {
  language: LandingLanguage;
  page: LandingPage;
}) {
  const homePath = getLandingPath(language, "home");
  const youtubeChannelLink =
    language === LandingLanguage.ru
      ? links.youtubeChannelRu
      : links.youtubeChannelEn;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 md:border-none"
      style={{
        backgroundColor: "hsla(0, 0%, 100%, .86)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      <div className="container relative mx-auto flex max-w-(--breakpoint-lg) items-center justify-between px-4 py-4 lg:max-w-5xl xl:max-w-6xl">
        <a href={homePath} className="flex items-center font-semibold gap-2">
          <img src={"/logoI.png"} alt="MemoCard Logo" className="h-6" />
          <span>MemoCard</span>
        </a>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 space-x-6 md:flex">
          <a href={links.botChannel} className="text font-semibold">
            Telegram
          </a>
          <a href={youtubeChannelLink} className="text font-semibold">
            YouTube
          </a>
          <a
            href={page === "home" ? "#pricing" : `${homePath}#pricing`}
            className="text font-semibold"
          >
            Pro
          </a>
          <a href={links.github} className="text font-semibold">
            GitHub
          </a>
        </nav>
        <div className="flex items-center">
          <LanguageSwitcher page={page} />
        </div>
      </div>
    </header>
  );
}
