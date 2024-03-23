import { PlanDb } from "../../../functions/db/plan/schema.ts";

export const getPlanTitle = (plan: PlanDb) => {
  switch (plan.type) {
    case "plus":
      return `Plus`;
    case "pro":
      return `Pro`;
    case "deck_producer":
      return "";
    default:
      return plan.type satisfies never;
  }
};

export const getPlanDescription = (plan: PlanDb) => {
  switch (plan.type) {
    case "plus":
      return ["Duplicate folder, deck", "Priority support"];
    case "pro":
      return [
        "Duplicate folder, deck",
        "One time deck and folder links",
        "Deck and folder access duration",
        "High priority support",
      ];
    case "deck_producer":
      return [];
    default:
      return plan.type satisfies never;
  }
};

export const getPlanFullTile = (plan: PlanDb) => {
  return `${getPlanTitle(plan)} (${formatPlanPrice(plan)}/mo.)`;
};

export const formatPlanPrice = (plan: PlanDb) => {
  return `$${plan.price}`;
};

export const getBuyText = (plan: PlanDb) => {
  return `Buy "${getPlanTitle(plan)}" for ${formatPlanPrice(plan)}`;
};
