"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import {
  AudioLines,
  Copy,
  Ellipsis,
  FolderTree,
  Languages,
  LibraryBig,
  Mic,
  PencilLine,
  Share,
  SquarePen,
  Volume2,
  Wifi,
} from "lucide-react";
import { LandingLanguage, links } from "api";

const en = {
  benefitCreateTitle: "Create complete decks",
  benefitCreateDescription: "Folders, decks, and cards in 1 request",
  benefitImproveTitle: "Improve existing cards",
  benefitImproveDescription:
    "AI fixes wording, adds examples, and fills vocabulary gaps",
  benefitManageTitle: "Manage your whole library",
  benefitManageDescription: "AI quickly organizes cards into decks and folders",
  benefitTranscriptionTitle: "Add phonetic transcriptions",
  benefitTranscriptionDescription: "AI adds the correct pronunciation",
  benefitTranslateTitle: "Translate entire decks",
  benefitTranslateDescription: "Create a copy in another language in 1 request",
  sectionTitle: "MemoCard Pro",
  sectionDescription:
    "Go Pro to manage your cards with ChatGPT and spend less time on busywork",
  proTitle: "Manage MemoCard with ChatGPT",
  proDescription: "Create, edit and improve your decks via ChatGPT",
  proInputPlaceholder: "Ask ChatGPT",
  proShowExampleTitle: "Show example",
  proNewChatTitle: "New chat",
  proMoreTitle: "More",
  proAddTitle: "Add",
  proVoiceInputTitle: "Voice input",
  proVoiceModeTitle: "Start voice mode",
  proCreatePrompt: "Create 20 cards with English travel vocabulary",
  proCreateResponse: "Done — I added 20 new cards",
  proCreateDetail: "Your English · Travel deck now has 148 cards",
  proReviewPrompt: "Review my Family deck and add any missing words",
  proReviewResponse: "I found 6 missing words and added them",
  proReviewDetail: "Your Family deck now has 12 cards",
  proOrganizePrompt: "Organize my language decks into folders",
  proOrganizeResponse: "Done — I organized them into 3 folders",
  proOrganizeDetail: "Every card kept its review history",
  upgradePro: "Upgrade to Pro · $4/mo",
} as const;

type ProPlanTranslation = {
  [Key in keyof typeof en]: string;
};

const ru: ProPlanTranslation = {
  benefitCreateTitle: "Создавайте готовые колоды",
  benefitCreateDescription: "Папки, колоды и карточки — за 1 запрос",
  benefitImproveTitle: "Улучшайте карточки",
  benefitImproveDescription:
    "ИИ исправит формулировки, добавит примеры и недостающую лексику",
  benefitManageTitle: "Управляйте всей библиотекой",
  benefitManageDescription: "ИИ быстро разложит карточки по колодам и папкам",
  benefitTranscriptionTitle: "Добавляйте транскрипции",
  benefitTranscriptionDescription: "ИИ добавит правильное произношение",
  benefitTranslateTitle: "Переводите целые колоды",
  benefitTranslateDescription: "Создавайте копию на другом языке за 1 запрос",
  sectionTitle: "MemoCard Pro",
  sectionDescription:
    "Перейдите на Pro, чтобы управлять карточками через ChatGPT и тратить меньше времени на рутину",
  proTitle: "Управляйте MemoCard через ChatGPT",
  proDescription: "Создавайте, редактируйте и улучшайте колоды через ChatGPT",
  proInputPlaceholder: "Спросить ChatGPT",
  proShowExampleTitle: "Показать пример",
  proNewChatTitle: "Новый чат",
  proMoreTitle: "Ещё",
  proAddTitle: "Добавить",
  proVoiceInputTitle: "Голосовой ввод",
  proVoiceModeTitle: "Начать голосовой режим",
  proCreatePrompt: "Создай 20 карточек с английскими словами о путешествиях",
  proCreateResponse: "Готово — добавил 20 новых карточек",
  proCreateDetail: "Теперь в колоде «Английский · Путешествия» 148 карточек",
  proReviewPrompt: "Проверь колоду «Семья» и добавь недостающие слова",
  proReviewResponse: "Нашёл и добавил 6 недостающих слов",
  proReviewDetail: "Теперь в колоде «Семья» 12 карточек",
  proOrganizePrompt: "Разложи мои языковые колоды по папкам",
  proOrganizeResponse: "Готово — распределил их по 3 папкам",
  proOrganizeDetail: "История повторений всех карточек сохранена",
  upgradePro: "Получить Pro · 350 руб/мес",
};

const es: ProPlanTranslation = {
  benefitCreateTitle: "Crea mazos completos",
  benefitCreateDescription: "Carpetas, mazos y tarjetas con 1 sola petición",
  benefitImproveTitle: "Mejora tus tarjetas",
  benefitImproveDescription:
    "La IA corrige los textos, añade ejemplos y completa el vocabulario que falta",
  benefitManageTitle: "Gestiona toda tu biblioteca",
  benefitManageDescription:
    "La IA organiza rápidamente las tarjetas en mazos y carpetas",
  benefitTranscriptionTitle: "Añade transcripciones fonéticas",
  benefitTranscriptionDescription: "La IA añadirá la pronunciación correcta",
  benefitTranslateTitle: "Traduce mazos completos",
  benefitTranslateDescription:
    "Crea una copia en otro idioma con 1 sola petición",
  sectionTitle: "MemoCard Pro",
  sectionDescription:
    "Pásate a Pro para gestionar tus tarjetas con ChatGPT y dedicar menos tiempo a tareas rutinarias",
  proTitle: "Gestiona MemoCard con ChatGPT",
  proDescription: "Crea, edita y mejora tus mazos con ChatGPT",
  proInputPlaceholder: "Pregunta a ChatGPT",
  proShowExampleTitle: "Mostrar ejemplo",
  proNewChatTitle: "Nuevo chat",
  proMoreTitle: "Más",
  proAddTitle: "Añadir",
  proVoiceInputTitle: "Entrada de voz",
  proVoiceModeTitle: "Iniciar modo de voz",
  proCreatePrompt: "Crea 20 tarjetas con vocabulario en inglés sobre viajes",
  proCreateResponse: "Listo — añadí 20 tarjetas nuevas",
  proCreateDetail: "Tu mazo «Inglés · Viajes» ahora tiene 148 tarjetas",
  proReviewPrompt: "Revisa mi mazo «Familia» y añade las palabras que faltan",
  proReviewResponse: "Encontré 6 palabras que faltaban y las añadí",
  proReviewDetail: "Tu mazo «Familia» ahora tiene 12 tarjetas",
  proOrganizePrompt: "Organiza mis mazos de idiomas en carpetas",
  proOrganizeResponse: "Listo — los organicé en 3 carpetas",
  proOrganizeDetail: "Todas las tarjetas conservaron su historial de repaso",
  upgradePro: "Obtener Pro · $4/mes",
};

const ptBr: ProPlanTranslation = {
  benefitCreateTitle: "Crie baralhos completos",
  benefitCreateDescription: "Pastas, baralhos e cartões em 1 solicitação",
  benefitImproveTitle: "Melhore seus cartões",
  benefitImproveDescription:
    "A IA ajusta os textos, adiciona exemplos e completa o vocabulário que falta",
  benefitManageTitle: "Gerencie toda a sua biblioteca",
  benefitManageDescription:
    "A IA organiza rapidamente os cartões em baralhos e pastas",
  benefitTranscriptionTitle: "Adicione transcrições fonéticas",
  benefitTranscriptionDescription: "A IA adicionará a pronúncia correta",
  benefitTranslateTitle: "Traduza baralhos completos",
  benefitTranslateDescription:
    "Crie uma cópia em outro idioma em 1 solicitação",
  sectionTitle: "MemoCard Pro",
  sectionDescription:
    "Assine o Pro para gerenciar seus cartões com o ChatGPT e gastar menos tempo com tarefas repetitivas",
  proTitle: "Gerencie o MemoCard com ChatGPT",
  proDescription: "Crie, edite e melhore seus baralhos com ChatGPT",
  proInputPlaceholder: "Pergunte ao ChatGPT",
  proShowExampleTitle: "Mostrar exemplo",
  proNewChatTitle: "Novo chat",
  proMoreTitle: "Mais",
  proAddTitle: "Adicionar",
  proVoiceInputTitle: "Entrada de voz",
  proVoiceModeTitle: "Iniciar modo de voz",
  proCreatePrompt: "Crie 20 cartões com vocabulário em inglês sobre viagens",
  proCreateResponse: "Pronto — adicionei 20 cartões novos",
  proCreateDetail: "Seu baralho «Inglês · Viagens» agora tem 148 cartões",
  proReviewPrompt:
    "Revise meu baralho «Família» e adicione as palavras que estão faltando",
  proReviewResponse: "Encontrei 6 palavras que faltavam e as adicionei",
  proReviewDetail: "Seu baralho «Família» agora tem 12 cartões",
  proOrganizePrompt: "Organize meus baralhos de idiomas em pastas",
  proOrganizeResponse: "Pronto — organizei tudo em 3 pastas",
  proOrganizeDetail: "Todos os cartões mantiveram o histórico de revisão",
  upgradePro: "Obter Pro · $4/mês",
};

const uk: ProPlanTranslation = {
  benefitCreateTitle: "Створюйте повноцінні колоди",
  benefitCreateDescription: "Папки, колоди й картки — за 1 запит",
  benefitImproveTitle: "Покращуйте картки",
  benefitImproveDescription:
    "ШІ виправить формулювання, додасть приклади й доповнить словниковий запас",
  benefitManageTitle: "Керуйте всією бібліотекою",
  benefitManageDescription: "ШІ швидко розкладе картки за колодами й папками",
  benefitTranscriptionTitle: "Додавайте фонетичні транскрипції",
  benefitTranscriptionDescription: "ШІ додасть правильну вимову",
  benefitTranslateTitle: "Перекладайте цілі колоди",
  benefitTranslateDescription: "Створіть копію іншою мовою за 1 запит",
  sectionTitle: "MemoCard Pro",
  sectionDescription:
    "Перейдіть на Pro, щоб керувати картками через ChatGPT і витрачати менше часу на рутину",
  proTitle: "Керуйте MemoCard через ChatGPT",
  proDescription: "Створюйте, редагуйте й покращуйте колоди через ChatGPT",
  proInputPlaceholder: "Запитати ChatGPT",
  proShowExampleTitle: "Показати приклад",
  proNewChatTitle: "Новий чат",
  proMoreTitle: "Більше",
  proAddTitle: "Додати",
  proVoiceInputTitle: "Голосове введення",
  proVoiceModeTitle: "Почати голосовий режим",
  proCreatePrompt: "Створи 20 карток з англійськими словами про подорожі",
  proCreateResponse: "Готово — додано 20 нових карток",
  proCreateDetail: "Тепер у колоді «Англійська · Подорожі» 148 карток",
  proReviewPrompt: "Перевір колоду «Сім’я» й додай слова, яких бракує",
  proReviewResponse: "Знайшов і додав 6 слів, яких бракувало",
  proReviewDetail: "Тепер у колоді «Сім’я» 12 карток",
  proOrganizePrompt: "Розклади мої мовні колоди за папками",
  proOrganizeResponse: "Готово — розподілено за 3 папками",
  proOrganizeDetail: "Історію повторень усіх карток збережено",
  upgradePro: "Оновити до Pro · $4/міс",
};

const translations: Record<LandingLanguage, ProPlanTranslation> = {
  [LandingLanguage.en]: en,
  [LandingLanguage.ru]: ru,
  [LandingLanguage.es]: es,
  [LandingLanguage.ptBr]: ptBr,
  [LandingLanguage.uk]: uk,
};

const CHAT_EXAMPLES = [
  {
    promptKey: "proCreatePrompt",
    responseKey: "proCreateResponse",
    detailKey: "proCreateDetail",
  },
  {
    promptKey: "proReviewPrompt",
    responseKey: "proReviewResponse",
    detailKey: "proReviewDetail",
  },
  {
    promptKey: "proOrganizePrompt",
    responseKey: "proOrganizeResponse",
    detailKey: "proOrganizeDetail",
  },
] as const;

const BENEFITS = [
  {
    icon: LibraryBig,
    iconColor: "#5454d6",
    titleKey: "benefitCreateTitle",
    descriptionKey: "benefitCreateDescription",
  },
  {
    icon: PencilLine,
    iconColor: "#0e77f1",
    titleKey: "benefitImproveTitle",
    descriptionKey: "benefitImproveDescription",
  },
  {
    icon: FolderTree,
    iconColor: "#16a6c3",
    titleKey: "benefitManageTitle",
    descriptionKey: "benefitManageDescription",
  },
  {
    icon: AudioLines,
    iconColor: "#1abe8a",
    titleKey: "benefitTranscriptionTitle",
    descriptionKey: "benefitTranscriptionDescription",
  },
  {
    icon: Languages,
    iconColor: "#1edb59",
    titleKey: "benefitTranslateTitle",
    descriptionKey: "benefitTranslateDescription",
  },
] as const;

const AUTO_ADVANCE_MS = 4500;
const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: "grapheme",
});

const splitGraphemes = (text: string) =>
  Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);

export function ProPlanSection({ language }: { language: LandingLanguage }) {
  const translation = translations[language];

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        className="mx-auto mb-12 w-full max-w-6xl scroll-mt-24 px-4 pt-24 md:pt-28"
        id="pricing"
      >
        <div className="mx-auto mb-8 max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold text-black md:text-4xl">
            {translation.sectionTitle}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-gray-600">
            {translation.sectionDescription}
          </p>
        </div>

        <div className="rounded-[32px] bg-[#efeff3] p-3 shadow-[0_12px_32px_rgba(15,23,42,0.08)] md:p-6">
          <div className="grid justify-items-center gap-3 lg:grid-cols-[430px_minmax(0,1fr)] lg:items-stretch">
            <div className="w-full max-w-[430px] overflow-hidden rounded-[28px] bg-white px-4 pb-5 pt-7 shadow-[0_12px_24px_rgba(0,0,0,0.05)]">
              <h2 className="mx-auto max-w-[320px] text-center text-[30px] font-bold leading-[1.05] tracking-[-0.035em] text-black">
                {translation.proTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-[315px] text-center text-[16px] leading-[1.45] text-[#999]">
                {translation.proDescription}
              </p>

              <ChatConversation language={language} translation={translation} />
            </div>

            <div className="flex w-full max-w-[430px] min-w-0 flex-col rounded-[24px] bg-white px-[18px] pb-[18px] pt-6 shadow-[0_12px_24px_rgba(0,0,0,0.05)] lg:max-w-none">
              <div className="overflow-hidden rounded-xl">
                {BENEFITS.map((benefit, index) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      className="flex items-center gap-2 bg-white ps-3"
                      key={benefit.titleKey}
                    >
                      <div
                        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: benefit.iconColor }}
                      >
                        <Icon size={17} />
                      </div>
                      <div
                        className={`flex-1 py-3 ${
                          index !== BENEFITS.length - 1
                            ? "border-b border-[#efeff3]"
                            : ""
                        }`}
                      >
                        <div className="text-[15px] font-semibold leading-5 text-black">
                          {translation[benefit.titleKey]}
                        </div>
                        <div className="mt-0.5 pe-2 text-[13px] leading-[1.35] text-[#999]">
                          {translation[benefit.descriptionKey]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <a
                className="mt-auto flex min-h-14 items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 via-blue-500 to-blue-600 px-5 py-3 text-center text-[17px] font-semibold text-white shadow-md transition duration-300 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 active:scale-[0.99]"
                href={`${links.appBrowser}/?type=plans&planType=pro`}
              >
                {translation.upgradePro}
              </a>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

function ChatConversation({
  language,
  translation,
}: {
  language: LandingLanguage;
  translation: ProPlanTranslation;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplay] = useState(() =>
    Autoplay({
      delay: AUTO_ADVANCE_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      duration: 28,
      loop: true,
    },
    [autoplay],
  );

  const syncSelectedIndex = useCallback(() => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    syncSelectedIndex();
    emblaApi.on("reInit", syncSelectedIndex);
    emblaApi.on("select", syncSelectedIndex);

    return () => {
      emblaApi.off("reInit", syncSelectedIndex);
      emblaApi.off("select", syncSelectedIndex);
    };
  }, [emblaApi, syncSelectedIndex]);

  const selectSlide = (index: number) => {
    emblaApi?.scrollTo(index);
    autoplay.reset();
  };

  return (
    <div className="mt-6">
      <div
        className="cursor-grab touch-pan-y select-none overflow-hidden bg-white active:cursor-grabbing"
        ref={emblaRef}
      >
        <div className="flex gap-3">
          {CHAT_EXAMPLES.map((example, index) => (
            <div
              className="min-w-0 flex-[0_0_100%]"
              key={`${example.promptKey}-${language}`}
            >
              <PhoneFrame
                example={example}
                isActive={selectedIndex === index}
                translation={translation}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-1 flex justify-center gap-1">
        {CHAT_EXAMPLES.map((item, index) => (
          <button
            className="flex h-8 w-8 items-center justify-center"
            key={item.promptKey}
            onClick={() => selectSlide(index)}
            title={`${translation.proShowExampleTitle} ${index + 1}`}
            type="button"
          >
            <span
              className={`h-2 w-8 rounded-full transition-colors ${
                index === selectedIndex ? "bg-[#2481cc]" : "bg-[#52615c]/25"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function PhoneFrame({
  example,
  isActive,
  translation,
}: {
  example: (typeof CHAT_EXAMPLES)[number];
  isActive: boolean;
  translation: ProPlanTranslation;
}) {
  const prompt = translation[example.promptKey];
  const response = translation[example.responseKey];
  const detail = translation[example.detailKey];
  const { responseGraphemes, detailGraphemes, fullReplyLength } =
    useMemo(() => {
      const nextResponseGraphemes = splitGraphemes(response);
      const nextDetailGraphemes = splitGraphemes(detail);

      return {
        responseGraphemes: nextResponseGraphemes,
        detailGraphemes: nextDetailGraphemes,
        fullReplyLength:
          nextResponseGraphemes.length + nextDetailGraphemes.length + 1,
      };
    }, [detail, response]);
  const [hasStarted, setHasStarted] = useState(false);
  const [replyStarted, setReplyStarted] = useState(false);
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    if (isActive) {
      setHasStarted(true);
    }
  }, [isActive]);

  useEffect(() => {
    setReplyStarted(false);
    setTypedLength(0);

    if (!hasStarted) {
      return;
    }

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      setReplyStarted(true);
      intervalId = window.setInterval(() => {
        setTypedLength((length) => {
          if (length >= fullReplyLength) {
            if (intervalId !== undefined) {
              window.clearInterval(intervalId);
            }
            return length;
          }

          return length + 1;
        });
      }, 22);
    }, 520);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [fullReplyLength, hasStarted]);

  const typedResponse = responseGraphemes
    .slice(0, Math.min(typedLength, responseGraphemes.length))
    .join("");
  const typedDetail =
    typedLength > responseGraphemes.length
      ? detailGraphemes
          .slice(0, typedLength - responseGraphemes.length - 1)
          .join("")
      : "";
  const replyComplete = typedLength >= fullReplyLength;

  return (
    <div className="h-[442px] rounded-[37px] bg-[#0c0c0c] p-[7px]">
      <div className="relative h-full overflow-hidden rounded-[31px] bg-[#fdfdfd] text-[#111]">
        <div className="relative z-20 flex h-9 items-center justify-between px-[18px] pt-1 text-[12px] font-bold tracking-[-0.02em]">
          <span>13:21</span>
          <div className="flex items-center gap-[5px]">
            <div className="flex h-3 items-end gap-[2px]">
              {[4, 6, 8, 11].map((height) => (
                <span
                  className="w-[3px] rounded-[1px] bg-[#111]"
                  key={height}
                  style={{ height }}
                />
              ))}
            </div>
            <Wifi size={14} strokeWidth={3} />
            <span className="relative h-[11px] w-[22px] rounded-[4px] border-[1.5px] border-[#767676]">
              <span className="absolute inset-[1.5px] rounded-[2px] bg-[#111]" />
              <span className="absolute -right-[3px] top-[3px] h-[4px] w-[2px] rounded-r bg-[#767676]" />
            </span>
          </div>
        </div>

        <div className="relative z-20 flex h-[58px] items-start justify-between px-3 pt-1.5">
          <button
            className="flex size-11 items-center justify-center rounded-full bg-white shadow-[0_10px_28px_rgba(0,0,0,0.12)]"
            title="ChatGPT"
            type="button"
          >
            <ChatGptIcon />
          </button>
          <div className="flex h-11 items-center gap-1 rounded-full bg-white px-2 shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
            <button
              className="flex size-8 items-center justify-center rounded-full"
              title={translation.proNewChatTitle}
              type="button"
            >
              <SquarePen size={20} strokeWidth={2.4} />
            </button>
            <button
              className="flex size-8 items-center justify-center rounded-full"
              title={translation.proMoreTitle}
              type="button"
            >
              <Ellipsis size={22} strokeWidth={2.8} />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-[62px] top-[88px] overflow-hidden">
          <m.div
            animate={
              hasStarted
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.97, y: 34 }
            }
            className="ms-auto mt-2 max-w-[82%] rounded-[22px] rounded-br-[7px] bg-[#f1f1f1] px-4 py-3 text-start text-[13px] font-medium leading-[1.35]"
            initial={{ opacity: 0, scale: 0.97, y: 34 }}
            transition={{
              duration: 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {prompt}
          </m.div>

          {replyStarted && (
            <m.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-[13px] leading-[1.48]"
              initial={{ opacity: 0, y: 7 }}
              transition={{ duration: 0.22 }}
            >
              <p className="m-0 min-h-[1.48em] text-[#111]">{typedResponse}</p>
              {(typedDetail || typedLength > responseGraphemes.length) && (
                <p className="m-0 mt-3 text-[#111]">{typedDetail}</p>
              )}
              {replyComplete && <ChatGptActions />}
            </m.div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 bg-linear-to-t from-white via-white to-white/0 px-3 pb-2.5 pt-5">
          <div className="flex h-[50px] items-center gap-2 rounded-full bg-white px-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.03]">
            <button
              className="flex size-8 shrink-0 items-center justify-center rounded-full"
              title={translation.proAddTitle}
              type="button"
            >
              <ProperPlusIcon />
            </button>
            <span className="min-w-0 flex-1 truncate text-[14px] text-[#9b9b9b]">
              {translation.proInputPlaceholder}
            </span>
            <button
              className="flex size-8 shrink-0 items-center justify-center rounded-full"
              title={translation.proVoiceInputTitle}
              type="button"
            >
              <Mic size={21} strokeWidth={2.2} />
            </button>
            <button
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#111] text-white"
              title={translation.proVoiceModeTitle}
              type="button"
            >
              <AudioLines size={19} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatGptActions() {
  return (
    <m.div
      animate={{ opacity: 1 }}
      className="mt-3.5 flex items-center gap-3 text-[#646464]"
      initial={{ opacity: 0 }}
      transition={{ delay: 0.55, duration: 0.25 }}
    >
      <Copy size={15} strokeWidth={2.1} />
      <Volume2 size={15} strokeWidth={2.1} />
      <Share size={15} strokeWidth={2.1} />
      <Ellipsis size={17} strokeWidth={2.6} />
    </m.div>
  );
}

function ChatGptIcon() {
  return (
    <img
      alt=""
      className="size-9 brightness-0"
      src="/img/pro/openai-blossom-white.svg"
    />
  );
}

function ProperPlusIcon() {
  return (
    <svg
      className="size-[23px]"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}
