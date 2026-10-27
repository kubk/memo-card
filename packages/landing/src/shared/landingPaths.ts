import { LandingLanguage } from "api";

export type LandingPage = "home" | "connectToClaude";

export function getLandingPath(language: LandingLanguage, page: LandingPage) {
  const prefix = language === LandingLanguage.en ? "" : `/${language}`;
  return page === "home" ? prefix || "/" : `${prefix}/connect-to-claude`;
}
