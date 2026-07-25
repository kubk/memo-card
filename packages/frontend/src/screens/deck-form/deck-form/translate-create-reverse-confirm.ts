import { selectPluralForm } from "api";
import { translator } from "../../../translations/t";

export function translateCreateReverseConfirm(count: number) {
  const language = translator.getLang();

  switch (language) {
    case "ru":
      return selectPluralForm("ru", count, {
        one: `Создать ${count} обратную карточку?`,
        few: `Создать ${count} обратные карточки?`,
        other: `Создать ${count} обратных карточек?`,
      });
    case "uk":
      return selectPluralForm("uk", count, {
        one: `Створити ${count} зворотну картку?`,
        few: `Створити ${count} зворотні картки?`,
        other: `Створити ${count} зворотних карток?`,
      });
    case "es":
      return count === 1
        ? `¿Crear ${count} tarjeta inversa?`
        : `¿Crear ${count} tarjetas inversas?`;
    case "pt-br":
      return count === 1
        ? `Criar ${count} cartão reverso?`
        : `Criar ${count} cartões reversos?`;
    case "ar":
      return `إنشاء ${count} بطاقات عكسية؟`;
    case "fa":
      return `ایجاد ${count} کارت معکوس؟`;
    case "en":
      return count === 1
        ? `Create ${count} reverse card?`
        : `Create ${count} reverse cards?`;
    default:
      return language satisfies never;
  }
}
