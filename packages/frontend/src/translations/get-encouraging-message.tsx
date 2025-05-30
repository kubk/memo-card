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
  "Дерево знаний не сможет расти без постоянного ухода. Продолжай поливать своё дерево знаний!",
  "Ты не просто повторяешь информацию; ты превращаешь ее в часть себя",
  "Подумай о накопленных знаниях, которые ты получаешь с каждым повторением. Будущий 'ты' благодарит тебя!",
];

const uk = [
  "Постійність — ключ до майстерності, і кожне повторення робить тебе кращим",
  "Пам'ятай, що шлях знань безмежний, і кожне заняття має значення",
  "Кожне повторення глибше вкарбовує знання у твою пам'ять. Молодець, що продовжуєш!",
  "Кожне повторення зміцнює твої нейронні зв'язки. Ти не просто вчишся — ти ростеш!",
  "Кожне повторення живить твоє майбутнє. Уяви, скільки ти дізнаєшся через рік!",
  "Як кажуть, 'Повторення — мати навчання.' Ти втілюєш цю мудрість у кожному занятті.",
  "Твої зусилля сьогодні — це основа для майбутньої майстерності. Продовжуй у тому ж дусі!",
  "Навчання — це як будувати замок, цеглина за цеглиною. Кожне повторення додає нову цеглинку до твоєї фортеці знань.",
  "Дерево знань не росте без постійного догляду. Поливай його регулярно!",
  "Ти не просто повторюєш інформацію — ти перетворюєш її на частину себе.",
];

const ar = [
  "الاستمرارية هي المفتاح للتميز، وكل خطوة تجعلك أفضل",
  "تذكر، رحلة المعرفة لا تنتهي، وكل جلسة لها قيمتها",
  "كل مراجعة تنقش المعرفة بعمق في ذاكرتك. أحسنت على المثابرة!",
  "كل مراجعة تقوي روابطك العصبية. أنت لا تتعلم فقط، بل تنمو أيضًا!",
  "كل مراجعة تغذي مستقبلك. تخيل أين ستكون بعد عام!",
  "كما يقول المثل، 'التكرار أم التعلم'. أنت تجسد هذه الحكمة في كل جلسة.",
  "جهودك اليوم هي أساس التميز في الغد. استمر في العمل الجيد!",
  "التعلم مثل بناء قلعة، حجرًا تلو الآخر. كل مراجعة تضيف حجرًا جديدًا إلى حصنك المعرفي.",
  "شجرة المعرفة تحتاج إلى رعاية مستمرة لتنمو. استمر في سقيها بانتظام!",
  "أنت لا تراجع المعلومات فقط؛ بل تجعلها جزءًا من شخصيتك.",
];

const fa = [
  "پیوستگی کلید موفقیت است، و هر گام تو را بهتر می‌کند",
  "یاد داشته باش که مسیر دانش بی‌پایان است، و هر جلسه اهمیت دارد",
  "هر مرور دانش را در ذهنت عمیق‌تر می‌کند. آفرین که ادامه می‌دهی!",
  "هر مرور اتصالات عصبی‌ات را تقویت می‌کند. تو فقط یاد نمی‌گیری، در حال رشد هستی!",
  "هر مرور آینده‌ات را تغذیه می‌کند. تصور کن که تا یک سال دیگر چقدر خواهی دانست!",
  "همانطور که می‌گویند، 'تکرار مادر یادگیری است'. تو این حکمت را در هر جلسه به کار می‌بری.",
  "تلاش‌های امروزت پایه‌ای برای موفقیت فرداست. ادامه بده!",
  "یادگیری مثل ساختن یک قلعه است، آجر به آجر. هر مرور، آجر دیگری به قلعه دانشت اضافه می‌کند.",
];

const es = [
  "La constancia es la clave de la maestría, y cada repetición te hace mejor",
  "Recuerda que el camino del conocimiento no tiene fin, y cada sesión cuenta",
  "Cada repetición profundiza el conocimiento en tu memoria. ¡Bien hecho por seguir adelante!",
  "Cada repetición fortalece tus conexiones neuronales. No solo aprendes, también creces.",
  "Cada repetición alimenta tu futuro. ¡Imagina cuánto sabrás dentro de un año!",
  "Como dice el refrán, 'La repetición es la madre del aprendizaje'. Estás adoptando esta sabiduría en cada sesión.",
  "El esfuerzo que haces hoy es la base de tu maestría de mañana. ¡Sigue así!",
  "Aprender es como construir un castillo ladrillo a ladrillo. Cada repetición añade una piedra más a tu fortaleza de conocimiento.",
  "El árbol de tu conocimiento necesita cuidado constante para crecer. Sigue regándolo.",
  "No estás solo repasando información; la estás integrando en tu esencia.",
];

const ptBr = [
  "A consistência é a chave para a maestria, e cada passo te torna melhor",
  "Lembre-se de que o caminho do conhecimento é infinito, e cada sessão conta",
  "Cada repetição aprofunda o conhecimento na sua memória. Parabéns por continuar!",
  "Cada repetição fortalece suas conexões neurais. Você não está apenas aprendendo; está evoluindo!",
  "Cada repetição alimenta o seu futuro. Imagine onde estará em um ano!",
  "Como diz o ditado, 'A repetição é a mãe do aprendizado'. Você está vivendo essa sabedoria a cada sessão.",
  "Seus esforços de hoje são a base da sua maestria amanhã. Continue assim!",
  "Aprender é como construir um castelo, tijolo por tijolo. Cada repetição adiciona uma pedra à sua fortaleza de conhecimento.",
  "Sua árvore do conhecimento precisa de cuidados constantes para crescer. Continue regando-a!",
  "Você não está apenas revisando informações; está tornando-as parte de quem você é.",
];

export const getEncouragingMessage = () => {
  const lang = translator.getLang();
  switch (lang) {
    case "ru":
      return random(ru);
    case "es":
      return random(es);
    case "pt-br":
      return random(ptBr);
    case "ar":
      return random(ar);
    case "fa":
      return random(fa);
    case "en":
      return random(en);
    case "uk":
      return random(uk);
    default:
      return lang satisfies never;
  }
};
