import { PlanDb } from "../../../functions/db/plan/schema.ts";
import { translator } from "../../translations/t.ts";
import {
  calcPlanPrice,
  PlanDuration,
} from "../../../shared/plan-calculator/calc-plan-price.ts";

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

export const getPlanDescription = (): [
  { title: string; description: string },
  { title: string; description: string },
  { title: string; description: string },
  { title: string; description: string },
  { title: string; description: string },
] => {
  const lang = translator.getLang();
  switch (lang) {
    case "en": {
      return [
        {
          title: "Up to 1000 cards per month using AI",
          description:
            "Simplify your life by generating cards instead of manually typing",
        },
        {
          title: "High quality AI speech generation",
          description:
            "Get high quality voiceovers instead of robotic voice for your cards",
        },
        {
          title: "Duplicate folder, deck",
          description: "Save time by duplicating your folders and decks",
        },
        {
          title: "One time links",
          description: "Share your decks and folders with one time links",
        },
        {
          title: "Specify access duration",
          description: "Control how long your decks and folders are accessible",
        },
      ];
    }
    case "ru": {
      return [
        {
          title: "1000 ИИ карточек в месяц",
          description:
            "Упростите свою жизнь, генерируя карточки вместо ввода вручную",
        },
        {
          title: "ИИ озвучка карточек",
          description: "Качественная озвучка вместо роботизированного голоса",
        },
        {
          title: "Дублирование папок, колод",
          description: "Экономьте время, дублируя папки и колоды",
        },
        {
          title: "Одноразовые ссылки",
          description: "Делитесь колодами и папками через одноразовые ссылки",
        },
        {
          title: "Длительность доступа",
          description:
            "Контролируйте, как долго ваши колоды и папки будут доступны другим пользователям",
        },
      ];
    }
    case "es": {
      return [
        {
          title: "Hasta 1000 tarjetas al mes usando IA",
          description:
            "Simplifica tu vida generando tarjetas en lugar de escribir manualmente",
        },
        {
          title: "Generación de voz IA de alta calidad",
          description:
            "Obtén locuciones de alta calidad en lugar de voz robótica para tus tarjetas",
        },
        {
          title: "Duplicar carpeta, baraja",
          description: "Ahorra tiempo duplicando tus carpetas y barajas",
        },
        {
          title: "Enlaces de un solo uso",
          description:
            "Comparte tus barajas y carpetas con enlaces de un solo uso",
        },
        {
          title: "Especificar duración de acceso",
          description:
            "Controla cuánto tiempo tus barajas y carpetas son accesibles",
        },
      ];
    }
    case "pt-br": {
      return [
        {
          title: "Até 1000 cartões por mês usando IA",
          description:
            "Simplifique sua vida gerando cartões em vez de digitar manualmente",
        },
        {
          title: "Geração de voz IA de alta qualidade",
          description:
            "Obtenha locuções de alta qualidade em vez de voz robótica para seus cartões",
        },
        {
          title: "Duplicar pasta, baralho",
          description: "Economize tempo duplicando suas pastas e baralhos",
        },
        {
          title: "Links de uso único",
          description:
            "Compartilhe seus baralhos e pastas com links de uso único",
        },
        {
          title: "Especificar duração do acesso",
          description:
            "Controle por quanto tempo seus baralhos e pastas são acessíveis",
        },
      ];
    }
    default:
      return lang satisfies never;
  }
};

export const formatPrice = (price: number) => {
  return "$" + price;
};

export const translateDuration = (duration: PlanDuration) => {
  const lang = translator.getLang();
  switch (lang) {
    case "en": {
      const rulesEn = new Intl.PluralRules("en-US");
      const resultEn = rulesEn.select(duration);
      switch (resultEn) {
        case "one":
          return `${duration} month`;
        case "other":
        default:
          return `${duration} months`;
      }
    }
    case "ru": {
      const rulesRu = new Intl.PluralRules("ru-RU");
      const result = rulesRu.select(duration);
      switch (result) {
        case "one":
          return `${duration} месяц`;
        case "few":
          return `${duration} месяца`;
        case "many":
          return `${duration} месяцев`;
        case "two":
        default:
          return `${duration} месяца`;
      }
    }
    case "es": {
      const rulesEs = new Intl.PluralRules("es-ES");
      const resultEs = rulesEs.select(duration);
      switch (resultEs) {
        case "one":
          return `${duration} mes`;
        case "other":
        default:
          return `${duration} meses`;
      }
    }
    case "pt-br": {
      const rulesPt = new Intl.PluralRules("pt-br");
      const resultPt = rulesPt.select(duration);
      switch (resultPt) {
        case "one":
          return `${duration} mês`;
        case "other":
        default:
          return `${duration} meses`;
      }
    }
    default:
      return lang satisfies never;
  }
};

export const getBuyText = (plan: PlanDb, duration: PlanDuration) => {
  const lang = translator.getLang();
  const price = formatPrice(calcPlanPrice(plan.price, duration));
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
