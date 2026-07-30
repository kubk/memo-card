import { selectPluralForm } from "api";
import { translator } from "../../translations/t.ts";

export const translateLeaderboardReviewLabel = (count: number) => {
  const language = translator.getLang();

  switch (language) {
    case "en":
      return selectPluralForm("en", count, {
        one: "review",
        other: "reviews",
      });
    case "ru":
      return selectPluralForm("ru", count, {
        one: "повторение",
        few: "повторения",
        many: "повторений",
        other: "повторения",
      });
    case "uk":
      return selectPluralForm("uk", count, {
        one: "повторення",
        few: "повторення",
        many: "повторень",
        other: "повторення",
      });
    case "es":
      return selectPluralForm("es", count, {
        one: "repaso",
        other: "repasos",
      });
    case "pt-br":
      return selectPluralForm("pt-br", count, {
        one: "revisão",
        other: "revisões",
      });
    case "ar":
      return selectPluralForm("ar", count, {
        zero: "مراجعة",
        one: "مراجعة",
        two: "مراجعتان",
        few: "مراجعات",
        many: "مراجعة",
        other: "مراجعة",
      });
    case "fa":
      return selectPluralForm("fa", count, {
        one: "مرور",
        other: "مرور",
      });
    default:
      return language satisfies never;
  }
};

export const translateLeaderboardReviewsToPass = (count: number) => {
  const reviewLabel = translateLeaderboardReviewLabel(count);
  const language = translator.getLang();

  switch (language) {
    case "en":
      return `${reviewLabel} to pass`;
    case "ru":
      return `${reviewLabel}, чтобы обойти`;
    case "uk":
      return `${reviewLabel}, щоб обійти`;
    case "es":
      return `${reviewLabel} para superar a`;
    case "pt-br":
      return `${reviewLabel} para ultrapassar`;
    case "ar":
      return `${reviewLabel} لتجاوز`;
    case "fa":
      return `${reviewLabel} برای عبور از`;
    default:
      return language satisfies never;
  }
};
