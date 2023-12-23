import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN);

const main = async () => {
  await bot.api.setMyShortDescription(
    "Improve your memory with spaced repetition. Learn languages, history or other subjects with the proven flashcard method.",
    { language_code: "en" },
  );

  await bot.api.setMyDescription(
    "People tend to forget information. Within an hour, up to 60% of new information can slip away, and by the end of a week, only about 10% may remain. However, consistent revisiting of the information can combat this decline. This bot uses the proven flashcard method, assisting users in retaining and mastering languages, history, and more.",
    {
      language_code: "en",
    },
  );

  await bot.api.setMyShortDescription(
    "Улучшайте свою память с помощью интервального повторения. Изучайте языки, историю и другие предметы с помощью бота.",
    { language_code: "ru" },
  );

  await bot.api.setMyDescription(
    "Люди склонны забывать информацию. В течение часа забывается до 60% новой информации, а к концу недели может остаться около 10%. Однако постоянное повторение информации может предотвратить эту проблему. Этот бот использует метод интервального повторения, помогая пользователям сохранять и усваивать языки, историю и многое другое.",
    {
      language_code: "ru",
    },
  );

  await bot.api.setMyShortDescription(
    "Mejora tu memoria con la repetición espaciada.",
    { language_code: "es" },
  );

  await bot.api.setMyDescription(
    "Las personas tienden a olvidar la información. En una hora, hasta el 60% de la información nueva puede desaparecer, y al final de una semana, solo puede quedar alrededor del 10%. Sin embargo, la revisión constante de la información puede combatir este declive. Este bot utiliza el probado método de tarjetas de memoria, ayudando a los usuarios a retener y dominar idiomas, historia y más.",
    {
      language_code: "es",
    },
  );
};

main();
