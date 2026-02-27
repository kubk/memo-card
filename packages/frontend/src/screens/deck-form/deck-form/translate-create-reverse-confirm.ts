import { translator } from "../../../translations/t";

export const translateCreateReverseConfirm = (count: number) => {
  const language = translator.getLang();

  if (language === "ru") {
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

  if (language === "uk") {
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

  if (language === "es") {
    return count === 1
      ? `¿Crear ${count} tarjeta inversa?`
      : `¿Crear ${count} tarjetas inversas?`;
  }

  if (language === "pt-br") {
    return count === 1
      ? `Criar ${count} cartão reverso?`
      : `Criar ${count} cartões reversos?`;
  }

  if (language === "ar") {
    return `إنشاء ${count} بطاقات عكسية؟`;
  }

  if (language === "fa") {
    return `ایجاد ${count} کارت معکوس؟`;
  }

  return count === 1
    ? `Create ${count} reverse card?`
    : `Create ${count} reverse cards?`;
};
