import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { m } from "framer-motion";
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
import { LazyLoadFramerMotion } from "../../lib/framer-motion/lazy-load-framer-motion.tsx";
import { mcpT } from "../mcp-settings/translations.ts";
import { userStore } from "../../store/user-store.ts";
import { cn } from "../../ui/cn.ts";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { List } from "../../ui/list.tsx";
import { theme } from "../../ui/theme.tsx";

const CHAT_EXAMPLES = [
  {
    promptKey: "proReversePrompt",
    responseKey: "proReverseResponse",
    detailKey: "proReverseDetail",
  },
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

const AUTO_ADVANCE_MS = 4500;
const graphemeSegmenter = new Intl.Segmenter(undefined, {
  granularity: "grapheme",
});

const splitGraphemes = (text: string) =>
  Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);

const BENEFITS = [
  {
    icon: <LibraryBig size={17} />,
    iconColor: theme.icons.violet,
    titleKey: "benefitCreateTitle",
    descriptionKey: "benefitCreateDescription",
  },
  {
    icon: <PencilLine size={17} />,
    iconColor: theme.icons.blue,
    titleKey: "benefitImproveTitle",
    descriptionKey: "benefitImproveDescription",
  },
  {
    icon: <FolderTree size={17} />,
    iconColor: theme.icons.turquoise,
    titleKey: "benefitManageTitle",
    descriptionKey: "benefitManageDescription",
  },
  {
    icon: <AudioLines size={17} />,
    iconColor: theme.icons.sea,
    titleKey: "benefitTranscriptionTitle",
    descriptionKey: "benefitTranscriptionDescription",
  },
  {
    icon: <Languages size={17} />,
    iconColor: theme.icons.green,
    titleKey: "benefitTranslateTitle",
    descriptionKey: "benefitTranslateDescription",
  },
] as const;

export function ProPage({
  footer,
  notice,
  flush = false,
}: {
  footer?: ReactNode;
  notice?: ReactNode;
  flush?: boolean;
}) {
  return (
    <LazyLoadFramerMotion>
      <div
        className="min-h-full w-full bg-secondary-bg text-text"
        dir={userStore.isRtl ? "rtl" : "ltr"}
      >
        <main
          className={cn(
            "mx-auto w-full max-w-[430px] pb-20 pt-1",
            !flush && "px-3",
          )}
        >
          {notice ? <div className="mb-3">{notice}</div> : null}

          <section className="overflow-hidden rounded-[28px] bg-bg px-4 pb-5 pt-7 shadow">
            <h1 className="mx-auto max-w-[320px] text-center text-[30px] font-bold leading-[1.05] tracking-[-0.035em]">
              {mcpT("proTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-[315px] text-center text-[16px] leading-[1.45] text-hint">
              {mcpT("proDescription")}
            </p>

            <ChatConversation />
          </section>

          <section className="mt-3 rounded-[24px] bg-bg pb-[5.33px] pt-5 shadow">
            <div className="px-[18px]">
              <AutoFitHeading text={mcpT("proBenefitsTitle")} />
            </div>

            <div className="mx-1.5 mt-4 overflow-hidden rounded-xl">
              <List
                animateTap={false}
                items={BENEFITS.map((benefit) => ({
                  icon: (
                    <FilledIcon
                      backgroundColor={benefit.iconColor}
                      icon={benefit.icon}
                    />
                  ),
                  text: (
                    <div className="py-0.5">
                      <div className="text-[15px] font-semibold leading-5">
                        {mcpT(benefit.titleKey)}
                      </div>
                      <div className="mt-0.5 pe-2 text-[13px] leading-[1.35] text-hint">
                        {mcpT(benefit.descriptionKey)}
                      </div>
                    </div>
                  ),
                }))}
              />
            </div>
          </section>

          {footer ? <div className="mt-2">{footer}</div> : null}
        </main>
      </div>
    </LazyLoadFramerMotion>
  );
}

function AutoFitHeading({ text }: { text: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const heading = headingRef.current;
    if (!heading) {
      return;
    }

    const fitText = () => {
      const maxFontSize = 22;
      heading.style.fontSize = `${maxFontSize}px`;

      if (heading.scrollWidth <= heading.clientWidth) {
        return;
      }

      let largestFit = 1;
      let smallestOverflow = maxFontSize;

      for (let index = 0; index < 10; index += 1) {
        const candidate = (largestFit + smallestOverflow) / 2;
        heading.style.fontSize = `${candidate}px`;

        if (heading.scrollWidth <= heading.clientWidth) {
          largestFit = candidate;
        } else {
          smallestOverflow = candidate;
        }
      }

      heading.style.fontSize = `${Math.floor(largestFit * 10) / 10}px`;
    };

    fitText();
    window.addEventListener("resize", fitText);

    return () => {
      window.removeEventListener("resize", fitText);
    };
  }, [text]);

  return (
    <h2
      className="w-full whitespace-nowrap text-[22px] font-bold leading-tight tracking-[-0.02em]"
      ref={headingRef}
    >
      {text}
    </h2>
  );
}

function ChatConversation() {
  const isRtl = userStore.isRtl;
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
      direction: isRtl ? "rtl" : "ltr",
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
        className="cursor-grab touch-pan-y select-none overflow-hidden bg-bg active:cursor-grabbing"
        dir={isRtl ? "rtl" : "ltr"}
        ref={emblaRef}
      >
        <div className="flex gap-3">
          {CHAT_EXAMPLES.map((example, index) => (
            <div
              className="min-w-0 flex-[0_0_100%]"
              key={`${example.promptKey}-${userStore.language}`}
            >
              <PhoneFrame
                example={example}
                isActive={selectedIndex === index}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {CHAT_EXAMPLES.map((item, index) => (
          <button
            className={`h-1.5 rounded-full transition-all ${
              index === selectedIndex
                ? "w-5 bg-button"
                : "w-1.5 bg-[#52615c]/25"
            }`}
            key={item.promptKey}
            onClick={() => selectSlide(index)}
            title={`${mcpT("proShowExampleTitle")} ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

function PhoneFrame({
  example,
  isActive,
}: {
  example: (typeof CHAT_EXAMPLES)[number];
  isActive: boolean;
}) {
  const prompt = mcpT(example.promptKey);
  const response = mcpT(example.responseKey);
  const detail = mcpT(example.detailKey);
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
  const isRtl = userStore.isRtl;

  return (
    <div className="h-[442px] rounded-[37px] bg-[#0c0c0c] p-[7px]">
      <div
        className="relative h-full overflow-hidden rounded-[31px] bg-[#fdfdfd] text-[#111]"
        dir={isRtl ? "rtl" : "ltr"}
      >
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
            <ChatGptIcon className="size-9 brightness-0" />
          </button>
          <div className="flex h-11 items-center gap-1 rounded-full bg-white px-2 shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
            <button
              className="flex size-8 items-center justify-center rounded-full"
              title={mcpT("proNewChatTitle")}
              type="button"
            >
              <SquarePen size={20} strokeWidth={2.4} />
            </button>
            <button
              className="flex size-8 items-center justify-center rounded-full"
              title={mcpT("proMoreTitle")}
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
            className={cn(
              "ms-auto mt-2 max-w-[82%] rounded-[22px] bg-[#f1f1f1] px-4 py-3 text-start text-[13px] font-medium leading-[1.35]",
              isRtl ? "rounded-bl-[7px]" : "rounded-br-[7px]",
            )}
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

        <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-white via-white to-white/0 px-3 pb-2.5 pt-5">
          <div className="flex h-[50px] items-center gap-2 rounded-full bg-white px-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.03]">
            <button
              className="flex size-8 shrink-0 items-center justify-center rounded-full"
              title={mcpT("proAddTitle")}
              type="button"
            >
              <ProperPlusIcon />
            </button>
            <span className="min-w-0 flex-1 truncate text-[14px] text-[#9b9b9b]">
              {mcpT("proInputPlaceholder")}
            </span>
            <button
              className="flex size-8 shrink-0 items-center justify-center rounded-full"
              title={mcpT("proVoiceInputTitle")}
              type="button"
            >
              <Mic size={21} strokeWidth={2.2} />
            </button>
            <button
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#111] text-white"
              title={mcpT("proVoiceModeTitle")}
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

function ChatGptIcon({ className }: { className: string }) {
  return (
    <img alt="" className={className} src="/img/pro/openai-blossom-white.svg" />
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
