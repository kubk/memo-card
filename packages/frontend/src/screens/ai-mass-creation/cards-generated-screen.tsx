import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useAiMassCreationStore } from "./store/ai-mass-creation-store-provider.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { List } from "../../ui/list.tsx";
import { ListHeader } from "../../ui/list-header.tsx";
import { reset } from "../../ui/reset.ts";
import { t } from "../../translations/t.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { CardNumber } from "../../ui/card-number.tsx";
import { assert } from "api";
import { cn } from "../../ui/cn.ts";
import { TrashIcon } from "lucide-react";

export function CardsGeneratedScreen() {
  const store = useAiMassCreationStore();
  assert(store.massCreationForm);

  useBackButton(() => {
    store.onQuitBack();
  });

  useMainButton(
    () => {
      return t("add_deck");
    },
    () => {
      store.submitMassCreationForm();
    },
  );

  useProgress(() => store.isSavingCards);

  return (
    <Screen title={t("add_deck")}>
      <div>
        <ListHeader text={t("ai_cards_by_ai")} />
        <List
          items={store.massCreationForm.cards.value.map((card, i) => ({
            onClick: () => {
              assert(store.massCreationForm);
              store.massCreationForm.selectedCardIndex.onChange(i);
            },
            text: (
              <div>
                <div>
                  <CardNumber number={i + 1} />
                  {card.front}
                </div>
                <div className="text-hint text-sm">{card.back}</div>
              </div>
            ),
            right: store.canDeleteGeneratedCard ? (
              <button
                className={cn(reset.button, "pt-1 text-base")}
                onClick={(e) => {
                  e.stopPropagation();
                  store.deleteGeneratedCard(i);
                }}
              >
                <TrashIcon size={24} className="text-danger" />
              </button>
            ) : undefined,
          }))}
        />
      </div>
    </Screen>
  );
}
