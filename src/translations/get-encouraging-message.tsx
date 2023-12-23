import { translator } from "./t.ts";
import { random } from "../lib/array/random.ts";

const en = [
  "Consistency is the key to mastery, and each step makes you better",
  "Remember, the journey of knowledge is endless, and every session counts",
  "Keep up the momentum, and see you in the next review!",
  "It's all part of ensuring these nuggets of knowledge stick with you for the long run.",
  "Each review session carves the knowledge deeper into your memory. Well done for pushing through!",
  "Every review strengthens your neural connections. You're not just learning; you're growing!",
  "You're fueling your future self with every review. Imagine where you'll be a year from now!",
  "As the saying goes, 'Repetition is the mother of learning.' You're embracing this wisdom with every session.",
  "Your commitment today is the foundation for mastery tomorrow. Keep it up!",
  "Learning is like building a castle brick by brick. Every review adds another stone to your fortress of knowledge.",
  "Remember, the mightiest of trees grow from constant nurturing. Your knowledge is no different. Keep watering your learning tree!",
  "You're not just revisiting information; you're turning it into a part of who you are. Well done!",
  "Just think of the compounded knowledge you're getting with every review. Your future self thanks you!",
];

const ru = [
  "Постоянство — ключ к мастерству, и каждое повторение делает тебя лучше",
  "Помни, что путь знаний бесконечен, и каждое занятие имеет значение",
  "Каждое повторение углубляет знания в твоей памяти. Молодец, что не сдаёшься!",
  "Каждое повторение укрепляет твои нейронные связи. Те не просто учишься, ты растёшь!",
  "Каждое повторение подпитывает твоё будущее. Представь, сколько всего ты будешь знать через год!",
  "Как говорится, 'Повторение - мать учения.' Ты воплощаешь эту мудрость в каждом занятии.",
  "Твои усилия сегодня — основа для мастерства завтра. Продолжай в том же духе!",
  "Учиться — это как строить замок кирпич за кирпичом. Каждое повторение добавляет еще один камень в твою крепость знаний.",
  "Дерево твоих знаний не сможет расти без постоянного ухода. Продолжай поливать ваше дерево знаний!",
  "Ты не просто повторяешь информацию; ты превращаешь ее в часть себя",
  "Подумай о накопленных знаниях, которые ты получаешь с каждым повторением. Будущий 'ты' благодарит тебя!",
];

export const getEncouragingMessage = () => {
  if (translator.getLang() === "ru") {
    return random(ru);
  }
  return random(en);
};
