import { translator } from "../../../translations/t";

export function translateCreateReverseConfirm(count: number) {
  const language = translator.getLang();

  switch (language) {
    case "ru": {
      const result = new Intl.PluralRules("ru-RU").select(count);
      switch (result) {
        case "one":
          return `Создать ${count} обратную карточку?`;
        case "few":
        case "two":
          return `Создать ${count} обратные карточки?`;
        default:
          return `Создать ${count} обратных карточек?`;
      }
    }
    case "uk": {
      const result = new Intl.PluralRules("uk-UA").select(count);
      switch (result) {
        case "one":
          return `Створити ${count} зворотну картку?`;
        case "few":
        case "two":
          return `Створити ${count} зворотні картки?`;
        default:
          return `Створити ${count} зворотних карток?`;
      }
    }
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
