import { PlanDb } from "../../../functions/db/plan/schema.ts";
import { translator } from "../../translations/t.ts";

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

export const getPlanDescription = (plan: PlanDb) => {
  const lang = translator.getLang();
  switch (plan.type) {
    case "pro":
      switch (lang) {
        case "en":
          return [
            "Generate up to 1000 cards per month using AI",
            "High quality AI speech generation for cards",
            "Duplicate folder, deck",
            "One time deck links and one time folder links",
            "Specify deck and folder access duration",
          ];
        case "ru":
          return [
            "Создание до 1000 карточек в месяц с использованием ИИ",
            "Озвучка карточек с использованием ИИ",
            "Дублирование папок, колод",
            "Одноразовые ссылки на колоды и папки",
            "Управление длительностью доступа к колодам и папкам",
          ];
        case "es":
          return [
            "Creación de hasta 1000 tarjetas al mes mediante IA",
            "Doblaje de alta calidad para tarjetas",
            "Duplicar carpeta, baraja",
            "Enlaces de carpeta y baraja de un solo uso",
            "Especificar la duración del acceso a la carpeta y la baraja",
          ];
        case "pt-br":
          return [
            "Criação de até 1000 cartões por mês usando IA",
            "Dublagem de alta qualidade para cartões",
            "Duplicar pasta, baralho",
            "Links de pasta e baralho de uso único",
            "Especificar a duração do acesso à pasta e ao baralho",
          ];
        default:
          return lang satisfies never;
      }
    case "plus":
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
