import { useState } from "react";
import { screenStore } from "../../../store/screen-store.ts";
import { BlocksIcon, BookOpenIcon, CirclePlayIcon } from "lucide-react";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { BooleanToggle } from "mobx-form-lite";
import { cn } from "../../../ui/cn.ts";
import { t } from "../../../translations/t.ts";
import { translateCardCount } from "../translate-card-count.ts";
import { hapticImpact } from "../../../lib/platform/telegram/haptics.ts";
import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { Choice } from "../../deck-list/deck-or-folder-choose/choice.tsx";
import { Flex } from "../../../ui/flex.tsx";

export function ReviewButton() {
  const [isMenuOpen] = useState(() => new BooleanToggle(false));

  if (deckListStore.myInfoRequest.isLoading || !deckListStore.myDecks.length) {
    return null;
  }

  return (
    <div className={cn("fixed bottom-6 end-6")}>
      <button
        onClick={() => {
          hapticImpact("medium");
          isMenuOpen.toggle();
        }}
        className="h-14 pt-0.5 w-14 rounded-full bg-button text-white shadow-xl flex items-center justify-center z-20 active:scale-95"
      >
        <CirclePlayIcon className="h-8 w-8 active:scale-95 transition-transform" />
      </button>

      <BottomSheet
        isOpen={isMenuOpen.value}
        onClose={() => isMenuOpen.setFalse()}
      >
        <Flex
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          mb={80}
          gap={48}
          fullWidth
        >
          <Flex fullWidth direction={"column"} gap={8}>
            <Choice
              icon={
                <BookOpenIcon className="text-text self-center" size={18} />
              }
              title={t("review_all_due")}
              description={translateCardCount(deckListStore.cardsToReviewCount)}
              onClick={() => {
                screenStore.go({ type: "reviewAll" });
                hapticImpact("light");
                isMenuOpen.setFalse();
              }}
            />
            <Choice
              icon={<BlocksIcon className="text-text self-center" size={18} />}
              title={t("review_custom")}
              description={translateCardCount(deckListStore.cardsTotalCount)}
              onClick={() => {
                screenStore.go({ type: "reviewCustom" });
                hapticImpact("light");
                isMenuOpen.setFalse();
              }}
            />
          </Flex>
        </Flex>
      </BottomSheet>
    </div>
  );
}
