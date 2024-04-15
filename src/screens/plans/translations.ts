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
          return ["Duplicate folder, deck"];
        case "ru":
          return ["Дублирование папок, колод"];
        case "es":
          return ["Duplicar carpeta, baraja"];
        case "pt-br":
          return ["Duplicar pasta, baralho"];
        default:
          return lang satisfies never;
      }
    case "pro":
      switch (lang) {
        case "en":
          return [
            "Card mass creation tools using AI",
            "Duplicate folder, deck",
            "One time deck links and one time folder links",
            "Specify deck and folder access duration",
            "High priority support",
          ];
        case "ru":
          return [
            "Инструменты массового создания карточек с использованием ИИ",
            "Дублирование папок, колод",
            "Одноразовые ссылки на колоды и папки",
            "Указание длительность доступа к колодам и папкам",
            "Приоритетная поддержка",
          ];
        case "es":
          return [
            "Herramientas de creación masiva de tarjetas utilizando IA",
            "Duplicar carpeta, baraja",
            "Enlaces de carpeta y baraja de un solo uso",
            "Especificar la duración del acceso a la carpeta y la baraja",
            "Soporte prioritario",
          ];
        case "pt-br":
          return [
            "Ferramentas de criação em massa de cartões usando IA",
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

export const getPlanFullPrice = (plan: PlanDb) => {
  const lang = translator.getLang();
  switch (lang) {
    case "en":
      return `${formatPlanPrice(plan)}/mo.`;
    case "ru":
      return `${formatPlanPrice(plan)}/мес.`;
    case "es":
      return `${formatPlanPrice(plan)}/mes`;
    case "pt-br":
      return `${formatPlanPrice(plan)}/mês`;
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
