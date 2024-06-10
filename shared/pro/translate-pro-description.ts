import { LanguageShared } from "../language/language-shared.ts";

export const translateShortProDescription = (lang: LanguageShared): string => {
  switch (lang) {
    case "en":
      return "Unlock advanced features: AI card generation, high quality AI speech generation, duplicate folders and decks";
    case "ru":
      return "Получите продвинутые функции: генерация карточек с ИИ, высококачественная генерация речи с ИИ, дублирование папок и колод";
    case "es":
      return "Desbloquee funciones avanzadas: generación de tarjetas de IA, generación de voz de IA de alta calidad, duplicar carpetas y barajas";
    case "pt-br":
      return "Desbloqueie recursos avançados: geração de cartões de IA, geração de voz de IA de alta qualidade, duplicar pastas e baralhos";
    default:
      return lang satisfies never;
  }
};

export const translateProDescription = (
  lang: LanguageShared,
): [
  { title: string; description: string },
  { title: string; description: string },
  { title: string; description: string },
  { title: string; description: string },
  { title: string; description: string },
] => {
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
