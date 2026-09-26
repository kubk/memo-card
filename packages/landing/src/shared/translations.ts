import { Bell, BookOpen, Folder, Headphones, PenTool } from "lucide-react";
import { LandingLanguage } from "api";

const en = {
  footer: {
    links: {
      tgSupport: "Telegram Support",
      runInBrowser: "Run in browser",
      runInTelegram: "Run in Telegram",
      youtubeChannelEn: "YouTube Channel (EN)",
      youtubeChannelRu: "YouTube Channel (RU)",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      telegramChannel: "Telegram Channel",
    },
    groupTitles: {
      support: "Support",
      run: "Run MemoCard",
      other: "Other",
    },
  },
  what: {
    title: "What is MemoCard?",
    description: "A flashcard app and a website to improve your memory",
  },
  features: {
    title: "Features",
    list: [
      {
        icon: Folder,
        title: "Create unlimited",
        description:
          "Create unlimited cards, decks, and folders to structure your knowledge.",
      },
      {
        icon: Bell,
        title: "Smart Notifications",
        description:
          "Receive daily reminders for cards that need review, optimizing your study time.",
      },
      {
        icon: Folder,
        title: "Quality Content",
        description: "Choose from a catalog of high-quality, pre-made decks.",
      },
      {
        icon: Headphones,
        title: "Text-to-Speech",
        description:
          "Learn foreign words with automatic pronunciation features.",
      },
      {
        icon: PenTool,
        title: "Custom Formatting",
        description:
          "Add styling to your cards to emphasize important information.",
      },
      {
        icon: BookOpen,
        title: "Different Card Types",
        description:
          "Use regular cards or cards with pre-made answers to test your knowledge.",
      },
    ],
  },
  hero: {
    title: "[Retain] what you learn",
    description1: `Within an hour, up to 60% of new information can slip away, and by the end of a week, only about 10% remain.`,
    description2: `[MemoCard] uses the proven flashcard method, making sure you never forget what you learn.`,
    tryBrowser: "Try in browser",
    tryTelegram: "Try in Telegram",
  },
  why: {
    awardWinningTitle: "Award-Winning App",
    awardWinningDescription:
      "Scored a prize in the worldwide Telegram mini app competition",
    usersTitle: "6000+ active users",
    usersDescription: "Join thousands of users",
  },
  useCases: {
    title: "What can I learn?",
    listEnum: {
      languages: "Languages",
      medicine: "Medicine",
      geography: "Geography",
      music: "Music",
      programming: "Programming",
      history: "History",
      mathematics: "Mathematics",
      chemistry: "Chemistry",
    },
    list: [
      "Learn a new language as a tourist",
      "Study Latin names of muscles for medical exams",
      "Improve geography skills",
      "Practice music harmony",
      "Memorize complex bash commands or programming constructs",
      "Retain key historical facts",
    ],
  },
  whyBetterThanAnki: {
    title: "Why It's Better Than Anki",
    list: [
      "No need for plugins - batteries included",
      "Decks and folders are easy to share via link",
      "Built-in smart push notifications via Telegram. You'll only see them when you have due cards to review",
      "No old creepy UI, MemoCard is already good looking",
    ],
  },
};

export type Translation = typeof en;

const ru: Translation = {
  what: {
    title: "Что такое MemoCard?",
    description: "A flashcard app and a website to improve your memory",
  },
  whyBetterThanAnki: {
    title: "Почему лучше, чем Anki",
    list: [
      "Нет необходимости в плагинах - всё включено",
      "Колодами и папками легко делиться по ссылке",
      "Встроенные умные уведомления через Telegram. Вы увидите их только тогда, когда у вас есть карточки для повторения",
      "Нет устаревшего интерфейса, MemoCard уже хорошо выглядит",
    ],
  },
  useCases: {
    title: "Сценарии применения",
    listEnum: {
      languages: "Языки",
      medicine: "Медицина",
      geography: "География",
      music: "Музыка",
      programming: "Программирование",
      history: "История",
      mathematics: "Математика",
      chemistry: "Химия",
    },
    list: [
      "Изучение нового языка в качестве туриста",
      "Запоминание сложных bash-команд или программных конструкций",
      "Изучение латинских названий мышц для медицинских экзаменов",
      "Улучшение географических навыков",
      "Практика музыкальной гармонии",
      "Запоминание ключевых исторических фактов",
    ],
  },
  why: {
    awardWinningTitle: "Победитель конкурса",
    awardWinningDescription: "MemoCard получил приз в конкурсе от Telegram",
    usersDescription: "Присоединяйтесь к тысячам пользователей",
    usersTitle: "6000+ активных пользователей",
  },
  footer: {
    links: {
      tgSupport: "Поддержка в Telegram",
      runInTelegram: "Запустить в Telegram",
      runInBrowser: "Запустить в браузере",
      youtubeChannelEn: "YouTube канал (EN)",
      youtubeChannelRu: "YouTube канал (RU)",
      termsOfService: "Условия использования",
      privacyPolicy: "Политика конфиденциальности",
      telegramChannel: "Telegram канал",
    },
    groupTitles: {
      run: "Запустить MemoCard",
      support: "Поддержка",
      other: "Другое",
    },
  },
  features: {
    title: "Функции",
    list: [
      {
        icon: Folder,
        title: "Создавайте без ограничений",
        description:
          "Создавайте неограниченное количество карточек, колод и папок для структурирования знаний.",
      },
      {
        icon: Bell,
        title: "Умные уведомления",
        description:
          "Получайте ежедневные напоминания о карточках, которые нужно повторить, оптимизируя время обучения.",
      },
      {
        icon: Folder,
        title: "Качественный контент",
        description: "Выбирайте из каталога высококачественных готовых колод.",
      },
      {
        icon: Headphones,
        title: "Озвучка текста",
        description:
          "Изучайте иностранные слова с автоматическим произношением.",
      },
      {
        icon: PenTool,
        title: "Пользовательское форматирование",
        description:
          "Добавляйте стили к карточкам для выделения важной информации.",
      },
      {
        icon: BookOpen,
        title: "Разные типы карточек",
        description:
          "Используйте обычные карточки или карточки с готовыми ответами для проверки знаний.",
      },
    ],
  },
  hero: {
    title: "Не забывайте то, что [запомнили]",
    description1: `В течение часа до 60% новой информации могут выскользнуть из памяти, а к концу недели остаются всего около 10%.`,
    description2: `[MemoCard] использует проверенный метод интервального повторения, чтобы вы никогда не забывали то, что запомнили.`,
    tryBrowser: "Запустить в браузере",
    tryTelegram: "Запустить в Telegram",
  },
};

const es: Translation = {
  what: {
    title: "¿Qué es MemoCard?",
    description:
      "Una aplicación de tarjetas flash y un sitio web para mejorar tu memoria",
  },
  whyBetterThanAnki: {
    title: "Por qué es mejor que Anki",
    list: [
      "No necesita complementos: baterías incluidas",
      "Las barajas y carpetas son fáciles de compartir mediante un enlace",
      "Notificaciones inteligentes integradas a través de Telegram. Solo las verás cuando tengas tarjetas pendientes de revisión",
      "No hay una interfaz antigua y espeluznante, MemoCard ya tiene un buen aspecto",
    ],
  },
  useCases: {
    title: "Casos de uso",
    listEnum: {
      languages: "Idiomas",
      medicine: "Medicina",
      geography: "Geografía",
      music: "Música",
      programming: "Programación",
      history: "Historia",
      mathematics: "Matemáticas",
      chemistry: "Química",
    },
    list: [
      "Aprender un nuevo idioma como turista",
      "Memorizar comandos bash complejos o construcciones de programación",
      "Estudiar los nombres latinos de los músculos para exámenes médicos",
      "Mejorar las habilidades de geografía",
      "Practicar la armonía musical",
      "Retener datos históricos clave",
    ],
  },
  why: {
    awardWinningTitle: "Aplicación galardonada",
    awardWinningDescription:
      "Obtuvo un premio en el concurso mundial de mini aplicaciones de Telegram",
    usersDescription: "Únete a miles de usuarios",
    usersTitle: "6000+ usuarios activos",
  },
  footer: {
    links: {
      tgSupport: "Soporte de Telegram",
      runInTelegram: "Ejecutar en Telegram",
      runInBrowser: "Ejecutar en el navegador",
      youtubeChannelEn: "Canal de YouTube (EN)",
      youtubeChannelRu: "Canal de YouTube (RU)",
      termsOfService: "Términos de servicio",
      privacyPolicy: "Política de privacidad",
      telegramChannel: "Canal de Telegram",
    },
    groupTitles: {
      run: "Ejecutar MemoCard",
      support: "Soporte",
      other: "Otro",
    },
  },
  features: {
    title: "Funciones",
    list: [
      {
        icon: Folder,
        title: "Crea sin límites",
        description:
          "Crea tarjetas, mazos y carpetas ilimitados para estructurar tu conocimiento.",
      },
      {
        icon: Bell,
        title: "Notificaciones inteligentes",
        description:
          "Recibe recordatorios diarios de las tarjetas que necesitas repasar, optimizando tu tiempo de estudio.",
      },
      {
        icon: Folder,
        title: "Contenido de calidad",
        description: "Elige del catálogo de mazos pre-hechos de alta calidad.",
      },
      {
        icon: Headphones,
        title: "Texto a voz",
        description:
          "Aprende palabras extranjeras con pronunciación automática.",
      },
      {
        icon: PenTool,
        title: "Formato personalizado",
        description:
          "Añade estilos a tus tarjetas para enfatizar información importante.",
      },
      {
        icon: BookOpen,
        title: "Diferentes tipos de tarjetas",
        description:
          "Usa tarjetas normales o tarjetas con respuestas pre-hechas para probar tu conocimiento.",
      },
    ],
  },
  hero: {
    title: "[Retén] lo que aprendes",
    description1: `En una hora, hasta el 60% de la información nueva puede escapar, y al final de una semana, solo queda alrededor del 10%.`,
    description2: `[MemoCard] utiliza el método de tarjetas de memoria probado, asegurándose de que nunca olvides lo que aprendes.`,
    tryBrowser: "Probar en el navegador",
    tryTelegram: "Probar en Telegram",
  },
};

const ptBr: Translation = {
  what: {
    title: "O que é MemoCard?",
    description:
      "Uma aplicação de tarjetas flash e um site para melhorar sua memória",
  },
  why: {
    awardWinningTitle: "Aplicativo premiado",
    awardWinningDescription:
      "Ganhou um prêmio na competição mundial de mini aplicativos do Telegram",
    usersDescription: "Junte-se a milhares de usuários",
    usersTitle: "6000+ usuários ativos",
  },
  footer: {
    links: {
      tgSupport: "Suporte no Telegram",
      runInTelegram: "Executar no Telegram",
      runInBrowser: "Executar no navegador",
      youtubeChannelEn: "Canal do YouTube (EN)",
      youtubeChannelRu: "Canal do YouTube (RU)",
      termsOfService: "Termos de serviço",
      privacyPolicy: "Política de privacidade",
      telegramChannel: "Canal do Telegram",
    },
    groupTitles: {
      run: "Executar MemoCard",
      support: "Suporte",
      other: "Outro",
    },
  },
  useCases: {
    title: "Casos de uso",
    listEnum: {
      languages: "Idiomas",
      medicine: "Medicina",
      geography: "Geografia",
      music: "Música",
      programming: "Programação",
      history: "História",
      mathematics: "Matemática",
      chemistry: "Química",
    },
    list: [
      "Aprender um novo idioma como turista",
      "Memorizar comandos bash complexos ou construções de programação",
      "Estudar os nomes latinos dos músculos para exames médicos",
      "Melhorar as habilidades de geografia",
      "Praticar a harmonia musical",
      "Retenha fatos históricos importantes",
    ],
  },
  whyBetterThanAnki: {
    title: "Por que é melhor que Anki",
    list: [
      "Não precisa de plugins - baterias incluídas",
      "Baralhos e pastas são fáceis de compartilhar via link",
      "Notificações inteligentes integradas via Telegram. Você só as verá quando tiver cartões pendentes para revisão",
      "Sem uma interface antiga e assustadora, o MemoCard já tem um bom aspecto",
    ],
  },
  features: {
    title: "Funcionalidades",
    list: [
      {
        icon: Folder,
        title: "Crie sem limites",
        description:
          "Crie cartões, baralhos e pastas ilimitados para estruturar seu conhecimento.",
      },
      {
        icon: Bell,
        title: "Notificações inteligentes",
        description:
          "Receba lembretes diários dos cartões que precisam de revisão, otimizando seu tempo de estudo.",
      },
      {
        icon: Folder,
        title: "Conteúdo de qualidade",
        description:
          "Escolha do catálogo de baralhos prontos de alta qualidade.",
      },
      {
        icon: Headphones,
        title: "Texto para fala",
        description: "Aprenda palavras estrangeiras com pronúncia automática.",
      },
      {
        icon: PenTool,
        title: "Formatação personalizada",
        description:
          "Adicione estilos aos seus cartões para destacar informações importantes.",
      },
      {
        icon: BookOpen,
        title: "Diferentes tipos de cartões",
        description:
          "Use cartões normais ou cartões com respostas prontas para testar seu conhecimento.",
      },
    ],
  },
  hero: {
    title: "[Retenha] o que você aprende",
    description1: `Em uma hora, até 60% das novas informações podem escapar, e no final de uma semana, apenas cerca de 10% permanecem.`,
    description2: `[MemoCard] usa o método comprovado de cartão de memória, garantindo que você nunca esqueça o que aprendeu.`,
    tryBrowser: "Experimente no navegador",
    tryTelegram: "Experimente no Telegram",
  },
};

const uk: Translation = {
  what: {
    title: "Що таке MemoCard?",
    description:
      "Додаток і вебсайт для покращення пам’яті за допомогою флешкарт",
  },
  why: {
    awardWinningTitle: "Нагороджений додаток",
    awardWinningDescription:
      "Отримав приз на всесвітньому конкурсі міні-додатків Telegram",
    usersDescription: "Приєднуйтесь до тисяч користувачів",
    usersTitle: "6000+ активних користувачів",
  },
  footer: {
    links: {
      tgSupport: "Підтримка в Telegram",
      runInTelegram: "Запустити в Telegram",
      runInBrowser: "Запустити в браузері",
      youtubeChannelEn: "YouTube канал (EN)",
      youtubeChannelRu: "YouTube канал (RU)",
      termsOfService: "Умови використання",
      privacyPolicy: "Політика конфіденційності",
      telegramChannel: "Telegram канал",
    },
    groupTitles: {
      run: "Запустити MemoCard",
      support: "Підтримка",
      other: "Інше",
    },
  },
  useCases: {
    title: "Сценарії використання",
    listEnum: {
      languages: "Мови",
      medicine: "Медицина",
      geography: "Географія",
      music: "Музика",
      programming: "Програмування",
      history: "Історія",
      mathematics: "Математика",
      chemistry: "Хімія",
    },
    list: [
      "Вивчення нового мови як туриста",
      "Запам'ятовування складних bash-команд або програмних конструкцій",
      "Вивчення латинських назв м'язів для медичних іспитів",
      "Покращення географічних навичок",
      "Практика музичної гармонії",
      "Запам'ятовування ключових історичних фактів",
    ],
  },
  whyBetterThanAnki: {
    title: "Чому краще, ніж Anki",
    list: [
      "Немає необхідності в плагінах - все включено",
      "Колоди та папки легко ділитися за посиланням",
      "Вбудовані розумні сповіщення через Telegram. Ви побачите їх тільки тоді, коли у вас є картки для повторення",
      "Немає старого страшного інтерфейсу, MemoCard вже добре виглядає",
    ],
  },
  features: {
    title: "Функції",
    list: [
      {
        icon: Folder,
        title: "Створюйте без обмежень",
        description:
          "Створюйте необмежену кількість карток, колод і папок для структурування знань.",
      },
      {
        icon: Bell,
        title: "Розумні сповіщення",
        description:
          "Отримуйте щоденні нагадування про картки, які потрібно повторити, оптимізуючи час навчання.",
      },
      {
        icon: Folder,
        title: "Якісний контент",
        description: "Обирайте з каталогу високоякісних готових колод.",
      },
      {
        icon: Headphones,
        title: "Озвучення тексту",
        description: "Вивчайте іноземні слова з автоматичною вимовою.",
      },
      {
        icon: PenTool,
        title: "Власне форматування",
        description:
          "Додавайте стилі до карток для виділення важливої інформації.",
      },
      {
        icon: BookOpen,
        title: "Різні типи карток",
        description:
          "Використовуйте звичайні картки або картки з готовими відповідями для перевірки знань.",
      },
    ],
  },
  hero: {
    title: "Не забувайте те, що [вивчили]",
    description1: `Протягом години до 60% нової інформації може вислизнути з пам'яті, а до кінця тижня залишається всього близько 10%.`,
    description2: `[MemoCard] використовує перевірений метод інтервального повторення, щоб ви ніколи не забували те, що вивчили.`,
    tryBrowser: "Запустити в браузері",
    tryTelegram: "Запустити в Telegram",
  },
};

export const getTranslation = (lang: LandingLanguage): Translation => {
  switch (lang) {
    case LandingLanguage.en:
      return en;
    case LandingLanguage.ru:
      return ru;
    case LandingLanguage.es:
      return es;
    case LandingLanguage.ptBr:
      return ptBr;
    case LandingLanguage.uk:
      return uk;
    default:
      return lang satisfies never;
  }
};
