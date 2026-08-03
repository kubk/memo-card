import { isLanguage, type LanguageShared } from "api";

export function normalizeLanguage(language?: string | null): LanguageShared {
  const normalized = language?.trim().toLowerCase().replaceAll("_", "-");

  if (isLanguage(normalized)) {
    return normalized;
  }

  const baseLanguage = normalized?.split("-")[0];

  switch (baseLanguage) {
    case "ru":
    case "es":
    case "uk":
    case "fa":
    case "ar":
      return baseLanguage;
    case "pt":
      return "pt-br";
    default:
      return "en";
  }
}
