import { type PaymentPlan } from "api";
import { t } from "../../translations/t.ts";
import { calcPlanPriceForDuration, PlanDuration } from "api";
import { formatPriceAsText } from "api";
import { PaymentMethodType } from "api";

export const getBuyText = (
  plan: PaymentPlan,
  duration: PlanDuration,
  method: PaymentMethodType,
) =>
  t("buy_plan", {
    title: plan.title,
    price: formatPriceAsText(
      calcPlanPriceForDuration(method, plan, duration),
      method,
    ),
  });
