import { motion } from "framer-motion";
import { Check, Copy, Layers3 } from "lucide-react";
import { translateProDescription } from "api";
import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { BottomSheetTitle } from "../../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { userStore } from "../../../store/user-store.ts";
import { t, translator } from "../../../translations/t.ts";

const cards = [
  { front: "hola", back: "hello" },
  { front: "gracias", back: "thank you" },
  { front: "adiós", back: "goodbye" },
];

const deckTreeDuration = 0.45;
const deckTreeLineDelay = 0.1;
const deckTreeCardDelay = 0.15;
const deckTreeCardStagger = 0.07;
const deckTreeCardDuration = 0.16;

function DeckTree(props: { delay: number; isCopy?: boolean }) {
  const { delay, isCopy = false } = props;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.12, ease: "easeOut" }}
      className="min-w-0 rounded-[16px] bg-bg p-3 shadow-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.02, duration: 0.18, ease: "easeOut" }}
        className="flex items-center gap-2"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-secondary-bg text-text">
          <Layers3 size={16} />
        </div>
        <div className="min-w-0 flex-1 text-xs font-medium leading-tight text-text">
          <bdi>
            {t(
              isCopy
                ? "duplicate_preview_deck_copy_title"
                : "duplicate_preview_deck_title",
            )}
          </bdi>
        </div>
        {isCopy ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: delay + deckTreeDuration - deckTreeCardDuration,
              duration: deckTreeCardDuration,
              ease: "easeOut",
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-white"
          >
            <Check size={12} strokeWidth={3} />
          </motion.div>
        ) : null}
      </motion.div>

      <div className="relative ms-4 ps-4 pt-3">
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{
            delay: delay + deckTreeLineDelay,
            duration: deckTreeDuration - deckTreeLineDelay,
            ease: "easeOut",
          }}
          className="absolute bottom-[17px] start-0 top-0 border-s border-divider dark:border-white/10"
          style={{ transformOrigin: "top" }}
        />
        <div className="space-y-1.5">
          {cards.map((card, index) => (
            <motion.div
              key={card.front}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: delay + deckTreeCardDelay + index * deckTreeCardStagger,
                duration: deckTreeCardDuration,
                ease: "easeOut",
              }}
              className="relative rounded-[9px] bg-secondary-bg px-2.5 py-1.5"
            >
              <div className="absolute -start-4 top-1/2 w-4 border-t border-divider dark:border-white/10" />
              <div className="truncate text-[11px] font-medium leading-tight text-text">
                <bdi>{card.front}</bdi>
              </div>
              <div className="truncate text-[10px] leading-tight text-hint">
                <bdi>{card.back}</bdi>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

type Props = {
  onClose: () => void;
  isOpen: boolean;
};

export function DuplicateContentPreview(props: Props) {
  const { onClose, isOpen } = props;
  const feature = translateProDescription(translator.getLang())[3];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div dir={userStore.isRtl ? "rtl" : "ltr"}>
        <Flex direction="column" alignItems="center" pb={24}>
          <BottomSheetTitle title={feature.title} onClose={onClose} />
          <div className="flex w-[90%] max-w-[520px] flex-col">
            <div className="grid grid-cols-[minmax(0,1fr)_52px_minmax(0,1fr)] items-center gap-1.5">
              <div className="min-w-0">
                <DeckTree delay={0.05} />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.62, duration: 0.22, ease: "easeOut" }}
                className="flex flex-col items-center gap-1.5 text-hint"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-bg text-text shadow-sm dark:border-white/10">
                  <Copy size={16} />
                </div>
                <div className="max-w-16 text-center text-[10px] leading-tight">
                  {t("duplicate")}
                </div>
              </motion.div>

              <div className="min-w-0">
                <DeckTree delay={0.92} isCopy />
              </div>
            </div>
          </div>
        </Flex>
      </div>
    </BottomSheet>
  );
}
