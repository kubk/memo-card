import type { ReactNode } from "react";
import { LandingLanguage, links } from "api";
import { getTranslation } from "@/shared/translations";
import { Footer } from "./footer";
import { Header } from "./header";

const en = {
  metaDescription:
    "Create, find, improve and organize MemoCard flashcards from Claude",
  title: "Connect MemoCard to Claude",
  intro:
    "Ask Claude to create, find, improve and organize flashcards in your MemoCard library, then study them in MemoCard on the web or in Telegram",
  requirementsTitle: "Requirements",
  requirements:
    "A MemoCard account with MemoCard Pro. You sign in with Telegram",
  connectTitle: "Connect",
  connectSteps: [
    "In Claude, open “Settings → Connectors” and browse the directory",
    "Find MemoCard and click “Connect”",
    "Sign in with Telegram on the MemoCard page and allow access",
    "Ask Claude to work with your cards",
  ],
  platforms:
    "The connector works in Claude on the web, desktop, iOS and Android",
  capabilitiesTitle: "What Claude can do",
  capabilities: [
    "Find your folders, decks and cards",
    "Create folders, decks and cards with examples",
    "Edit cards, decks and folders",
    "Move cards between decks while keeping their review history",
    "Delete cards, only when you explicitly ask",
  ],
  studying: "Studying and review scheduling stay in the MemoCard app",
  examplesTitle: "Example prompts",
  examples: [
    "Add a card “der Hund → the dog” to my German deck in MemoCard",
    "Create five Spanish restaurant flashcards in a new MemoCard deck",
    "Add example sentences to the cards in my Spanish deck",
    "Move the travel cards from my Spanish deck into a new deck",
  ],
  disconnectTitle: "Disconnect",
  disconnect:
    "Open “Settings → Connectors” in Claude, select MemoCard and disconnect it",
  privacyTitle: "Privacy",
  privacy:
    "MemoCard receives only what Claude passes to its tools, not your conversation",
};

type ConnectToClaudeTranslation = typeof en;

const ru: ConnectToClaudeTranslation = {
  metaDescription:
    "Создавайте, находите, улучшайте и упорядочивайте карточки MemoCard через Claude",
  title: "Подключите MemoCard к Claude",
  intro:
    "Просите Claude создавать, находить, улучшать и упорядочивать карточки в вашей библиотеке MemoCard, а учите их в MemoCard в браузере или в Telegram",
  requirementsTitle: "Что нужно",
  requirements: "Аккаунт MemoCard с MemoCard Pro. Вход через Telegram",
  connectTitle: "Подключение",
  connectSteps: [
    "В Claude откройте «Settings → Connectors» и перейдите в каталог",
    "Найдите MemoCard и нажмите «Connect»",
    "Войдите через Telegram на странице MemoCard и разрешите доступ",
    "Попросите Claude поработать с вашими карточками",
  ],
  platforms:
    "Коннектор работает в Claude в браузере, на компьютере, на iOS и Android",
  capabilitiesTitle: "Что умеет Claude",
  capabilities: [
    "Находить ваши папки, колоды и карточки",
    "Создавать папки, колоды и карточки с примерами",
    "Редактировать карточки, колоды и папки",
    "Переносить карточки между колодами с сохранением истории повторений",
    "Удалять карточки, только если вы явно попросите",
  ],
  studying: "Изучение и расписание повторений остаются в приложении MemoCard",
  examplesTitle: "Примеры запросов",
  examples: [
    "Добавь карточку «der Hund → собака» в мою немецкую колоду в MemoCard",
    "Создай пять карточек про ресторан на испанском в новой колоде MemoCard",
    "Добавь примеры предложений к карточкам в моей испанской колоде",
    "Перенеси карточки про путешествия из испанской колоды в новую колоду",
  ],
  disconnectTitle: "Отключение",
  disconnect:
    "Откройте «Settings → Connectors» в Claude, выберите MemoCard и отключите его",
  privacyTitle: "Конфиденциальность",
  privacy:
    "MemoCard получает только то, что Claude передаёт его инструментам, а не вашу переписку",
};

const es: ConnectToClaudeTranslation = {
  metaDescription:
    "Crea, busca, mejora y organiza tarjetas de MemoCard desde Claude",
  title: "Conecta MemoCard con Claude",
  intro:
    "Pide a Claude que cree, busque, mejore y organice tarjetas en tu biblioteca de MemoCard, y estúdialas en MemoCard en la web o en Telegram",
  requirementsTitle: "Requisitos",
  requirements:
    "Una cuenta de MemoCard con MemoCard Pro. Inicias sesión con Telegram",
  connectTitle: "Conexión",
  connectSteps: [
    "En Claude, abre «Settings → Connectors» y explora el directorio",
    "Busca MemoCard y haz clic en «Connect»",
    "Inicia sesión con Telegram en la página de MemoCard y permite el acceso",
    "Pide a Claude que trabaje con tus tarjetas",
  ],
  platforms:
    "El conector funciona en Claude en la web, en el escritorio, en iOS y en Android",
  capabilitiesTitle: "Qué puede hacer Claude",
  capabilities: [
    "Buscar tus carpetas, mazos y tarjetas",
    "Crear carpetas, mazos y tarjetas con ejemplos",
    "Editar tarjetas, mazos y carpetas",
    "Mover tarjetas entre mazos conservando su historial de repaso",
    "Eliminar tarjetas, solo cuando lo pidas explícitamente",
  ],
  studying: "El estudio y la programación de repasos siguen en la app MemoCard",
  examplesTitle: "Ejemplos de peticiones",
  examples: [
    "Añade una tarjeta «der Hund → el perro» a mi mazo de alemán en MemoCard",
    "Crea cinco tarjetas en español sobre el restaurante en un nuevo mazo de MemoCard",
    "Añade frases de ejemplo a las tarjetas de mi mazo de español",
    "Mueve las tarjetas de viaje de mi mazo de español a un nuevo mazo",
  ],
  disconnectTitle: "Desconexión",
  disconnect:
    "Abre «Settings → Connectors» en Claude, selecciona MemoCard y desconéctalo",
  privacyTitle: "Privacidad",
  privacy:
    "MemoCard recibe solo lo que Claude envía a sus herramientas, no tu conversación",
};

const ptBr: ConnectToClaudeTranslation = {
  metaDescription:
    "Crie, encontre, melhore e organize cartões do MemoCard pelo Claude",
  title: "Conecte o MemoCard ao Claude",
  intro:
    "Peça ao Claude para criar, encontrar, melhorar e organizar cartões na sua biblioteca do MemoCard e estude-os no MemoCard na web ou no Telegram",
  requirementsTitle: "Requisitos",
  requirements:
    "Uma conta do MemoCard com MemoCard Pro. O login é pelo Telegram",
  connectTitle: "Conexão",
  connectSteps: [
    "No Claude, abra «Settings → Connectors» e navegue pelo diretório",
    "Encontre o MemoCard e clique em «Connect»",
    "Entre com o Telegram na página do MemoCard e permita o acesso",
    "Peça ao Claude para trabalhar com seus cartões",
  ],
  platforms:
    "O conector funciona no Claude na web, no desktop, no iOS e no Android",
  capabilitiesTitle: "O que o Claude pode fazer",
  capabilities: [
    "Encontrar suas pastas, baralhos e cartões",
    "Criar pastas, baralhos e cartões com exemplos",
    "Editar cartões, baralhos e pastas",
    "Mover cartões entre baralhos mantendo o histórico de revisões",
    "Excluir cartões, somente quando você pedir explicitamente",
  ],
  studying: "Os estudos e o agendamento de revisões continuam no app MemoCard",
  examplesTitle: "Exemplos de pedidos",
  examples: [
    "Adicione um cartão «der Hund → o cachorro» ao meu baralho de alemão no MemoCard",
    "Crie cinco cartões de espanhol sobre restaurante em um novo baralho do MemoCard",
    "Adicione frases de exemplo aos cartões do meu baralho de espanhol",
    "Mova os cartões de viagem do meu baralho de espanhol para um novo baralho",
  ],
  disconnectTitle: "Desconexão",
  disconnect:
    "Abra «Settings → Connectors» no Claude, selecione o MemoCard e desconecte-o",
  privacyTitle: "Privacidade",
  privacy:
    "O MemoCard recebe apenas o que o Claude envia às suas ferramentas, não a sua conversa",
};

const uk: ConnectToClaudeTranslation = {
  metaDescription:
    "Створюйте, знаходьте, покращуйте та впорядковуйте картки MemoCard через Claude",
  title: "Підключіть MemoCard до Claude",
  intro:
    "Просіть Claude створювати, знаходити, покращувати та впорядковувати картки у вашій бібліотеці MemoCard, а вивчайте їх у MemoCard у браузері або в Telegram",
  requirementsTitle: "Що потрібно",
  requirements: "Акаунт MemoCard з MemoCard Pro. Вхід через Telegram",
  connectTitle: "Підключення",
  connectSteps: [
    "У Claude відкрийте «Settings → Connectors» і перейдіть до каталогу",
    "Знайдіть MemoCard і натисніть «Connect»",
    "Увійдіть через Telegram на сторінці MemoCard і дозвольте доступ",
    "Попросіть Claude попрацювати з вашими картками",
  ],
  platforms:
    "Конектор працює в Claude у браузері, на комп'ютері, на iOS та Android",
  capabilitiesTitle: "Що вміє Claude",
  capabilities: [
    "Знаходити ваші папки, колоди та картки",
    "Створювати папки, колоди та картки з прикладами",
    "Редагувати картки, колоди та папки",
    "Переносити картки між колодами зі збереженням історії повторень",
    "Видаляти картки, лише якщо ви явно попросите",
  ],
  studying: "Навчання та розклад повторень залишаються в застосунку MemoCard",
  examplesTitle: "Приклади запитів",
  examples: [
    "Додай картку «der Hund → собака» до моєї німецької колоди в MemoCard",
    "Створи п'ять карток про ресторан іспанською в новій колоді MemoCard",
    "Додай приклади речень до карток у моїй іспанській колоді",
    "Перенеси картки про подорожі з іспанської колоди в нову колоду",
  ],
  disconnectTitle: "Відключення",
  disconnect:
    "Відкрийте «Settings → Connectors» у Claude, виберіть MemoCard і відключіть його",
  privacyTitle: "Конфіденційність",
  privacy:
    "MemoCard отримує лише те, що Claude передає його інструментам, а не вашу переписку",
};

const translations: Record<LandingLanguage, ConnectToClaudeTranslation> = {
  [LandingLanguage.en]: en,
  [LandingLanguage.ru]: ru,
  [LandingLanguage.es]: es,
  [LandingLanguage.ptBr]: ptBr,
  [LandingLanguage.uk]: uk,
};

export function getConnectToClaudeHead(language: LandingLanguage) {
  const translation = translations[language];
  return {
    meta: [
      { title: translation.title },
      { name: "description", content: translation.metaDescription },
    ],
  };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-blue-600 hover:underline">
      {children}
    </a>
  );
}

export function ConnectToClaudePage({
  language,
}: {
  language: LandingLanguage;
}) {
  const translation = translations[language];
  const landingTranslation = getTranslation(language);
  const privacyPolicyHref =
    language === LandingLanguage.ru
      ? links.appBrowser + links.privacyPolicyRuPath
      : links.privacyPolicy;
  const termsOfServiceHref =
    language === LandingLanguage.ru
      ? links.appBrowser + links.tosRuPath
      : links.termsOfService;

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header language={language} page="connectToClaude" />

      <main className="container mx-auto max-w-3xl px-4 pt-28 pb-16 text-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {translation.title}
        </h1>
        <p>{translation.intro}</p>

        <Section title={translation.requirementsTitle}>
          <p>{translation.requirements}</p>
        </Section>

        <Section title={translation.connectTitle}>
          <ol className="list-decimal pl-6 space-y-2">
            {translation.connectSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-3">{translation.platforms}</p>
        </Section>

        <Section title={translation.capabilitiesTitle}>
          <ul className="list-disc pl-6 space-y-2">
            {translation.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
          <p className="mt-3">{translation.studying}</p>
        </Section>

        <Section title={translation.examplesTitle}>
          <ul className="list-disc pl-6 space-y-2">
            {translation.examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </Section>

        <Section title={translation.disconnectTitle}>
          <p>{translation.disconnect}</p>
        </Section>

        <Section title={translation.privacyTitle}>
          <p>{translation.privacy}</p>
          <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <TextLink href={privacyPolicyHref}>
              {landingTranslation.footer.links.privacyPolicy}
            </TextLink>
            <TextLink href={termsOfServiceHref}>
              {landingTranslation.footer.links.termsOfService}
            </TextLink>
          </p>
        </Section>
      </main>

      <Footer language={language} translation={landingTranslation} />
    </div>
  );
}
