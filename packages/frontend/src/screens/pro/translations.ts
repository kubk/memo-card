import { PlanDb } from "api";
import { translator } from "../../translations/t.ts";
import { calcPlanPriceForDuration, PlanDuration } from "api";
import { formatPriceAsText } from "api";
import { PaymentMethodType } from "api";

const getPlanTitle = (plan: PlanDb) => {
  switch (plan.type) {
    case "pro":
      return `Pro`;
    default:
      return "";
  }
};

export const getBuyText = (
  plan: PlanDb,
  duration: PlanDuration,
  method: PaymentMethodType,
) => {
  const lang = translator.getLang();
  const price = formatPriceAsText(
    calcPlanPriceForDuration(method, plan, duration),
    method,
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
    case "ar":
      return `اشتري "${getPlanTitle(plan)}" مقابل ${price}`;
    case "fa":
      return `خرید "${getPlanTitle(plan)}" برای ${price}`;
    case "uk":
      return `Купити "${getPlanTitle(plan)}" за ${price}`;
    default:
      return lang satisfies never;
  }
};
