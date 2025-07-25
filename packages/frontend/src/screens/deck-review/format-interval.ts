import { LanguageShared } from "api";

function languageToLocale(language: LanguageShared): string {
  switch (language) {
    case "en":
      return "en-US";
    case "ru":
      return "ru-RU";
    case "es":
      return "es-ES";
    case "pt-br":
      return "pt-BR";
    case "uk":
      return "uk-UA";
    case "fa":
      return "fa";
    case "ar":
      return "ar";
    default:
      return language satisfies never;
  }
}

export function formatInterval(
  intervalDays: number,
  language: LanguageShared,
): string {
  const locale = languageToLocale(language);
  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "always",
    style: "narrow",
  });

  const minutes = intervalDays * 24 * 60;
  const hours = intervalDays * 24;
  const weeks = intervalDays / 7;
  const months = intervalDays / 30;
  const years = intervalDays / 365;

  let result: string;
  if (hours < 1) {
    result = rtf.format(Math.round(minutes), "minute");
  } else if (hours < 24) {
    result = rtf.format(Math.round(hours), "hour");
  } else if (intervalDays < 10) {
    result = rtf.format(Math.round(intervalDays), "day");
  } else if (intervalDays < 30) {
    result = rtf.format(Math.round(weeks), "week");
  } else if (months < 12) {
    result = rtf.format(Math.round(months), "month");
  } else {
    // For years, show one decimal place
    const roundedYears = Math.round(years * 10) / 10;
    if (roundedYears % 1 === 0) {
      // If it's a whole number, format without decimal
      result = rtf.format(Math.round(roundedYears), "year");
    } else {
      // Manual formatting for decimal years since Intl doesn't support decimals
      // Get the year unit by formatting and then extracting just the unit part
      const formattedYear = new Intl.RelativeTimeFormat(locale, {
        numeric: "always",
        style: "narrow",
      }).format(2, "year");

      // First remove the number to get the rest of the string
      let yearUnit = formattedYear.replace(/[0-9.,]+/g, "").trim();

      // Remove common prefixes that might still be attached
      const prefixesToRemove = [
        "in ",
        "em ",
        "за ",
        "+",
        "خلال ",
        "dentro de ",
      ];
      for (const prefix of prefixesToRemove) {
        if (yearUnit.startsWith(prefix)) {
          yearUnit = yearUnit.substring(prefix.length).trim();
        }
      }

      // Handle Farsi suffix and any extra characters
      if (yearUnit.includes("بعد")) {
        yearUnit = yearUnit.replace("بعد", "").trim();
      }
      // Remove any lingering numbers (like ۲ in Farsi)
      yearUnit = yearUnit.replace(/[۰-۹0-9]/g, "").trim();

      // Special case: Portuguese uses "anos" but we want "a" for consistency
      if (locale === "pt-BR" && yearUnit === "anos") {
        yearUnit = "a";
      }

      result = `${roundedYears}${yearUnit}`;
    }
  }

  // Remove common prefixes for future time in different locales
  const prefixesToRemove = [
    "in ", // English
    "dentro de ", // Spanish
    "em ", // Portuguese
    "за ", // Ukrainian
    "+", // Russian
    "خلال ", // Arabic
    " بعد", // Farsi (suffix)
  ];

  for (const prefix of prefixesToRemove) {
    if (result.startsWith(prefix)) {
      result = result.substring(prefix.length);
      break;
    }
  }

  // Handle Farsi suffix
  if (result.endsWith(" بعد")) {
    result = result.substring(0, result.length - 4);
  }

  if (result.endsWith(".")) {
    result = result.substring(0, result.length - 1);
  }

  // Special case: Replace "anos" with "a" for Portuguese
  if (locale === "pt-BR" && result.includes("anos")) {
    result = result.replace("anos", "a");
  }

  return result;
}
