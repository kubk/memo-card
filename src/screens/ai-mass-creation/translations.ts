import { translator } from "../../translations/t.ts";

export const translateAddCards = (count: number) => {
  const language = translator.getLang();

  if (language === "ru") {
    const rules = new Intl.PluralRules("ru-RU");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return `Добавить ${count} карточку`;
      case "few":
      case "two":
        return `Добавить ${count} карточки`;
      default:
        return `Добавить ${count} карточек`;
    }
  }

  if (language === "es") {
    const rules = new Intl.PluralRules("es-ES");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return `Agregar ${count} tarjeta`;
      default:
        return `Agregar ${count} tarjetas`;
    }
  }

  if (language === "pt-br") {
    const rules = new Intl.PluralRules("pt-br");
    const result = rules.select(count);

    switch (result) {
      case "one":
        return `Adicionar ${count} cartão`;
      default:
        return `Adicionar ${count} cartões`;
    }
  }

  if (count === 1) {
    return `Add ${count} card`;
  }
  return `Add ${count} cards`;
};

export const translateHowMassCreationWorksText = () => {
  const language = translator.getLang();

  if (language === "en") {
    return {
      example1: "Example 1",
      example2: "Example 2",
      description:
        "Generate multiple cards at once using AI",
      promptExample1: "Generate 3 cards with capitals of the world",
      frontExample1: "Country",
      backExample1: "Capital",
      resultExample1:
        "You will get cards like Germany - Berlin, France - Paris, Canada - Ottawa",
      promptExample2:
        "Generate 2 cards with English French words related to fruits",
      frontExample2: "Fruit in English",
      backExample2: "Fruit in French",
      resultExample2: "You will get cards like Apple - Pomme, Banana - Banane",
    };
  }

  if (language === "ru") {
    return {
      example1: "Пример 1",
      example2: "Пример 2",
      description:
        "Генерируйте множество карточек за раз с использованием ИИ",
      promptExample1: "Сгенерируй 3 карточки со столицами мира",
      frontExample1: "Страна",
      backExample1: "Столица",
      resultExample1:
        "Пример результата: Германия - Берлин, Франция - Париж, Канада - Оттава",
      promptExample2:
        "Сгенерируй 2 карточки с русскими и французскими словами на тему фруктов",
      frontExample2: "Фрукт на русском",
      backExample2: "Фрукт на французском",
      resultExample2: "Пример результата: Яблоко - Pomme, Банан - Banane",
    };
  }

  if (language === "es") {
    return {
      example1: "Ejemplo 1",
      example2: "Ejemplo 2",
      description:
        "Genere múltiples tarjetas a la vez utilizando IA",
      promptExample1: "Generar 3 tarjetas con capitales del mundo",
      frontExample1: "País",
      backExample1: "Capital",
      resultExample1:
        "Obtendrá tarjetas como Alemania - Berlín, Francia - París, Canadá - Ottawa",
      promptExample2:
        "Genera 2 tarjetas con palabras en francés y español relacionadas con frutas",
      frontExample2: "Fruta en español",
      backExample2: "Fruta en francés",
      resultExample2: "Obtendrá tarjetas como Manzana - Pomme, Banana - Banane",
    };
  }

  if (language === "pt-br") {
    return {
      example1: "Exemplo 1",
      example2: "Exemplo 2",
      description:
        "Gere várias cartas de uma vez usando IA",
      promptExample1: "Gerar 3 cartas com capitais do mundo",
      frontExample1: "País",
      backExample1: "Capital",
      resultExample1:
        "Você obterá cartas como Alemanha - Berlim, França - Paris, Canadá - Ottawa",
      promptExample2:
        "Gere 2 letras com palavras em português e francês relacionadas a frutas",
      frontExample2: "Fruta em português",
      backExample2: "Fruta em francês",
      resultExample2: "Você obterá cartas como Maçã - Pomme, Banana - Banane",
    };
  }

  return language satisfies never;
};
