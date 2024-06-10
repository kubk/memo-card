import { PlanDb } from "../../../functions/db/plan/schema.ts";
import { translator } from "../../translations/t.ts";
import {
  calcPlanPriceForDuration,
  PlanDuration,
} from "../../../shared/pro/calc-plan-price-for-duration.ts";
import { formatStarsPrice } from "../../../shared/pro/format-price.ts";

export const getPlanTitle = (plan: PlanDb) => {
  switch (plan.type) {
    case "pro":
      return `Pro`;
    case "plus":
    case "deck_producer":
      return "";
    default:
      return plan.type satisfies never;
  }
};

export const getBuyText = (plan: PlanDb, duration: PlanDuration) => {
  const lang = translator.getLang();
  const price = formatStarsPrice(
    calcPlanPriceForDuration("stars", plan.price_stars, duration),
  );

  switch (lang) {
    case "en":
      return `Buy "${getPlanTitle(plan)}" for ${price}`;
    case "ru":
      return `Купить "${getPlanTitle(plan)}" за ${price}`;
    case "es":
      return `Comprar "${getPlanTitle(plan)}" por ${price}`;
    case "pt-br":
      return `Comprar "${getPlanTitle(plan)}" por ${price}`;
    default:
      return lang satisfies never;
  }
};
