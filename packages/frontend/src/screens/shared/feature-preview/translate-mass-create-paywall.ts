import { translator } from "../../../translations/t.ts";

export type MassCreatePaywallTranslation = {
  promptExample1: string;
  frontExample1: string;
  backExample1: string;
  resultExample1: [string, string][];
  youllGet: string;
  promptExample2: string;
  frontExample2: string;
  backExample2: string;
  resultExample2: [string, string][];
};

export function translateMassCreatePaywall(): MassCreatePaywallTranslation {
  const language = translator.getLang();

  if (language === "en") {
    return {
      promptExample1: "Generate 10 cards with capitals of the world",
      frontExample1: "Country",
      backExample1: "Capital",
      resultExample1: [
        ["Germany", "Berlin"],
        ["France", "Paris"],
        ["Canada", "Ottawa"],
        ["Japan", "Tokyo"],
        ["Australia", "Canberra"],
        ["Brazil", "Brasília"],
        ["Egypt", "Cairo"],
        ["India", "New Delhi"],
        ["Mexico", "Mexico City"],
        ["South Korea", "Seoul"],
      ],
      youllGet: "You'll get cards like",

      promptExample2:
        "Generate 6 cards with English French words related to fruits",
      frontExample2: "Fruit in English",
      backExample2: "Fruit in French",
      resultExample2: [
        ["Apple", "Pomme"],
        ["Banana", "Banane"],
        ["Orange", "Orange"],
        ["Strawberry", "Fraise"],
        ["Peach", "Pêche"],
        ["Pineapple", "Ananas"],
      ],
    };
  }

  if (language === "ru") {
    return {
      promptExample1: "Сгенерируй 10 карточек со столицами мира",
      frontExample1: "Страна",
      backExample1: "Столица",
      resultExample1: [
        ["Германия", "Берлин"],
        ["Франция", "Париж"],
        ["Канада", "Оттава"],
        ["Япония", "Токио"],
        ["Австралия", "Канберра"],
        ["Бразилия", "Бразилиа"],
        ["Египет", "Каир"],
        ["Индия", "Нью-Дели"],
        ["Мексика", "Мехико"],
        ["Южная Корея", "Сеул"],
      ],
      promptExample2:
        "Сгенерируй 6 карточек с русскими и французскими словами на тему фруктов",
      frontExample2: "Фрукт на русском",
      backExample2: "Фрукт на французском",
      resultExample2: [
        ["Яблоко", "Pomme"],
        ["Банан", "Banane"],
        ["Апельсин", "Orange"],
        ["Клубника", "Fraise"],
        ["Персик", "Pêche"],
        ["Ананас", "Ananas"],
      ],
      youllGet: "Вы получите такие карточки",
    };
  }

  if (language === "es") {
    return {
      promptExample1: "Generar 10 tarjetas con capitales del mundo",
      frontExample1: "País",
      backExample1: "Capital",
      resultExample1: [
        ["Alemania", "Berlín"],
        ["Francia", "París"],
        ["Canadá", "Ottawa"],
        ["Japón", "Tokio"],
        ["Australia", "Canberra"],
        ["Brasil", "Brasilia"],
        ["Egipto", "El Cairo"],
        ["India", "Nueva Delhi"],
        ["México", "Ciudad de México"],
        ["Corea del Sur", "Seúl"],
      ],
      promptExample2:
        "Genera 6 tarjetas con palabras en español y francés relacionadas con frutas",
      frontExample2: "Fruta en español",
      backExample2: "Fruta en francés",
      youllGet: "Obtendrás tarjetas como",
      resultExample2: [
        ["Manzana", "Pomme"],
        ["Plátano", "Banane"],
        ["Naranja", "Orange"],
        ["Fresa", "Fraise"],
        ["Melocotón", "Pêche"],
        ["Piña", "Ananas"],
      ],
    };
  }

  if (language === "pt-br") {
    return {
      promptExample1: "Gerar 10 cartões com capitais do mundo",
      frontExample1: "País",
      backExample1: "Capital",
      resultExample1: [
        ["Alemanha", "Berlim"],
        ["França", "Paris"],
        ["Canadá", "Ottawa"],
        ["Japão", "Tóquio"],
        ["Austrália", "Camberra"],
        ["Brasil", "Brasília"],
        ["Egito", "Cairo"],
        ["Índia", "Nova Délhi"],
        ["México", "Cidade do México"],
        ["Coreia do Sul", "Seul"],
      ],
      youllGet: "Você obterá cartões como",
      promptExample2:
        "Gere 6 cartões com palavras em português e francês relacionadas a frutas",
      frontExample2: "Fruta em português",
      backExample2: "Fruta em francês",
      resultExample2: [
        ["Maçã", "Pomme"],
        ["Banana", "Banane"],
        ["Laranja", "Orange"],
        ["Morango", "Fraise"],
        ["Pêssego", "Pêche"],
        ["Abacaxi", "Ananas"],
      ],
    };
  }

  if (language === "ar") {
    return {
      promptExample1: "إنشاء 10 بطاقات بعواصم العالم",
      frontExample1: "بلد",
      backExample1: "عاصمة",
      resultExample1: [
        ["ألمانيا", "برلين"],
        ["فرنسا", "باريس"],
        ["كندا", "أوتاوا"],
        ["اليابان", "طوكيو"],
        ["أستراليا", "كانبرا"],
        ["البرازيل", "برازيليا"],
        ["مصر", "القاهرة"],
        ["الهند", "نيودلهي"],
        ["المكسيك", "مدينة مكسيكو"],
        ["كوريا الجنوبية", "سيول"],
      ],
      youllGet: "ستحصل على بطاقات مثل",
      promptExample2: "إنشاء 6 بطاقات بكلمات عربية وفرنسية تتعلق بالفواكه",
      frontExample2: "فاكهة بالعربية",
      backExample2: "فاكهة بالفرنسية",
      resultExample2: [
        ["تفاح", "Pomme"],
        ["موز", "Banane"],
        ["برتقال", "Orange"],
        ["فراولة", "Fraise"],
        ["خوخ", "Pêche"],
        ["أناناس", "Ananas"],
      ],
    };
  }

  if (language === "fa") {
    return {
      promptExample1: "ساخت 10 کارت با پایتخت‌های جهان",
      frontExample1: "کشور",
      backExample1: "پایتخت",
      resultExample1: [
        ["آلمان", "برلین"],
        ["فرانسه", "پاریس"],
        ["کانادا", "اتاوا"],
        ["ژاپن", "توکیو"],
        ["استرالیا", "کانبرا"],
        ["برزیل", "برازیلیا"],
        ["مصر", "قاهره"],
        ["هند", "دهلی نو"],
        ["مکزیک", "مکزیکوسیتی"],
        ["کره جنوبی", "سئول"],
      ],
      youllGet: "شما کارت‌هایی مانند این دریافت خواهید کرد",
      promptExample2: "ساخت 6 کارت با کلمات فارسی و فرانسوی مرتبط با میوه‌ها",
      frontExample2: "میوه به فارسی",
      backExample2: "میوه به فرانسوی",
      resultExample2: [
        ["سیب", "Pomme"],
        ["موز", "Banane"],
        ["پرتقال", "Orange"],
        ["توت فرنگی", "Fraise"],
        ["هلو", "Pêche"],
        ["آناناس", "Ananas"],
      ],
    };
  }

  if (language === "uk") {
    return {
      promptExample1: "Згенеруй 10 карток зі столицями світу",
      frontExample1: "Країна",
      backExample1: "Столиця",
      resultExample1: [
        ["Німеччина", "Берлін"],
        ["Франція", "Париж"],
        ["Канада", "Оттава"],
        ["Японія", "Токіо"],
        ["Австралія", "Канберра"],
        ["Бразилія", "Бразиліа"],
        ["Єгипет", "Каїр"],
        ["Індія", "Нью-Делі"],
        ["Мексика", "Мехіко"],
        ["Південна Корея", "Сеул"],
      ],
      youllGet: "Ви отримаєте такі картки",
      promptExample2:
        "Згенеруй 6 карток з українськими та французькими словами, пов'язаними з фруктами",
      frontExample2: "Фрукт українською",
      backExample2: "Фрукт французькою",
      resultExample2: [
        ["Яблуко", "Pomme"],
        ["Банан", "Banane"],
        ["Апельсин", "Orange"],
        ["Полуниця", "Fraise"],
        ["Персик", "Pêche"],
        ["Ананас", "Ananas"],
      ],
    };
  }

  return language satisfies never;
}
