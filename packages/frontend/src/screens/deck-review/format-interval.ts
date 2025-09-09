import { LanguageShared } from "api";

type UnitType = "minute" | "hour" | "day" | "week" | "month" | "year";

const UNIT_MAPPINGS: Record<LanguageShared, Record<UnitType, string>> = {
  en: {
    minute: "m",
    hour: "h",
    day: "d",
    week: "w",
    month: "mo",
    year: "y",
  },
  ru: {
    minute: "мин",
    hour: "ч",
    day: "дн",
    week: "нед",
    month: "мес",
    year: "г",
  },
  es: {
    minute: "min",
    hour: "h",
    day: "d",
    week: "sem",
    month: "mes",
    year: "a",
  },
  "pt-br": {
    minute: "min",
    hour: "h",
    day: "d",
    week: "sem",
    month: "mês",
    year: "a",
  },
  uk: {
    minute: "хв",
    hour: "год",
    day: "дн",
    week: "тиж",
    month: "міс",
    year: "р",
  },
  fa: {
    minute: "دق",
    hour: "سا",
    day: "روز",
    week: "هفته",
    month: "ماه",
    year: "سال",
  },
  ar: {
    minute: "دق",
    hour: "سا",
    day: "يوم",
    week: "أسب",
    month: "شهر",
    year: "سنة",
  },
};

export function formatInterval(
  intervalDays: number,
  language: LanguageShared,
): string {
  const units = UNIT_MAPPINGS[language];

  const minutes = intervalDays * 24 * 60;
  const hours = intervalDays * 24;
  const weeks = intervalDays / 7;
  const months = intervalDays / 28;
  const years = intervalDays / 365;

  let value: number;
  let unit: string;

  if (hours < 1) {
    value = Math.round(minutes);
    unit = units.minute;
  } else if (hours < 24) {
    value = Math.round(hours);
    unit = units.hour;
  } else if (intervalDays < 7) {
    value = Math.round(intervalDays);
    unit = units.day;
  } else if (intervalDays < 28) {
    const roundedWeeks = Math.round(weeks * 10) / 10;
    value = roundedWeeks % 1 === 0 ? Math.round(roundedWeeks) : roundedWeeks;
    unit = units.week;
  } else if (intervalDays < 365) {
    const roundedMonths = Math.round(months * 10) / 10;
    value = roundedMonths % 1 === 0 ? Math.round(roundedMonths) : roundedMonths;
    unit = units.month;
  } else {
    const roundedYears = Math.round(years * 10) / 10;
    value = roundedYears % 1 === 0 ? Math.round(roundedYears) : roundedYears;
    unit = units.year;
  }

  return `${value} ${unit}`;
}
