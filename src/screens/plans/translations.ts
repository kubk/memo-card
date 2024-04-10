import { PlanDb } from "../../../functions/db/plan/schema.ts";
import { translator } from "../../translations/t.ts";

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
  const lang = translator.getLang();
  switch (plan.type) {
    case "plus":
      switch (lang) {
        case "en":
          return ["Duplicate folder, deck", "Priority support"];
        case "ru":
          return ["Дублирование папок, колод", "Приоритетная поддержка"];
        case "es":
          return ["Duplicar carpeta, baraja", "Soporte prioritario"];
        case "pt-br":
          return ["Duplicar pasta, baralho", "Suporte prioritário"];
        default:
          return lang satisfies never;
      }
    case "pro":
      switch (lang) {
        case "en":
          return [
            "Duplicate folder, deck",
            "One time deck links and one time folder links",
            "Specify deck and folder access duration",
            "High priority support",
          ];
        case "ru":
          return [
            "Дублирование папок, колод",
            "Одноразовые ссылки на колоды и папки",
            "Указание длительность доступа к колодам и папкам",
            "Приоритетная поддержка",
          ];
        case "es":
          return [
            "Duplicar carpeta, baraja",
            "Enlaces de carpeta y baraja de un solo uso",
            "Especificar la duración del acceso a la carpeta y la baraja",
            "Soporte prioritario",
          ];
        case "pt-br":
          return [
            "Duplicar pasta, baralho",
            "Links de pasta e baralho de uso único",
            "Especificar a duração do acesso à pasta e ao baralho",
            "Suporte prioritário",
          ];
        default:
          return lang satisfies never;
      }
    case "deck_producer":
      return [];
    default:
      return plan.type satisfies never;
  }
};

export const getPlanFullTile = (plan: PlanDb) => {
  const lang = translator.getLang();
  switch (lang) {
    case "en":
      return `${getPlanTitle(plan)} (${formatPlanPrice(plan)}/mo.)`;
    case "ru":
      return `${getPlanTitle(plan)} (${formatPlanPrice(plan)}/мес.)`;
    case "es":
      return `${getPlanTitle(plan)} (${formatPlanPrice(plan)}/mes)`;
    case "pt-br":
      return `${getPlanTitle(plan)} (${formatPlanPrice(plan)}/mês)`;
    default:
      return lang satisfies never;
  }
};

export const formatPlanPrice = (plan: PlanDb) => {
  return `$${plan.price}`;
};

export const getBuyText = (plan: PlanDb) => {
  const lang = translator.getLang();
  switch (lang) {
    case "en":
      return `Buy "${getPlanTitle(plan)}" for ${formatPlanPrice(plan)}`;
    case "ru":
      return `Купить "${getPlanTitle(plan)}" за ${formatPlanPrice(plan)}`;
    case "es":
      return `Comprar "${getPlanTitle(plan)}" por ${formatPlanPrice(plan)}`;
    case "pt-br":
      return `Comprar "${getPlanTitle(plan)}" por ${formatPlanPrice(plan)}`;
    default:
      return lang satisfies never;
  }
};
