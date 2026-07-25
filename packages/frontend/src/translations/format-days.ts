import { selectPluralForm } from "api";
import { translator } from "./t.ts";

export const formatDays = (days: number) => {
  const language = translator.getLang();

  switch (language) {
    case "en":
      return `${days === 1 ? "1 day" : `${days} days`}`;
    case "ru":
      return `${days} ${selectPluralForm("ru", days, {
        one: "день",
        few: "дня",
        many: "дней",
        other: "дня",
      })}`;
    case "pt-br": {
      return days === 1 ? "1 dia" : `${days} dias`;
    }
    case "es":
      return `${days} ${selectPluralForm("es", days, {
        one: "día",
        other: "días",
      })}`;
    case "ar":
      return `${days} ${selectPluralForm("ar", days, {
        one: "يوم",
        few: "أيام",
        many: "يومًا",
        other: "يومًا",
      })}`;
    case "fa":
      return `${days} ${selectPluralForm("fa", days, {
        one: "روز",
        other: "روز",
      })}`;
    case "uk":
      return `${days} ${selectPluralForm("uk", days, {
        one: "день",
        few: "дні",
        many: "днів",
        other: "дні",
      })}`;
    default:
      return language satisfies never;
  }
};
