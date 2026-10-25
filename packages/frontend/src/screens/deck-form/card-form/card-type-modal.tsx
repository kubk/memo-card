import type { DeckCardDbType } from "api";
import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { t } from "../../../translations/t.ts";
import { RadioList } from "../../../ui/radio-list/radio-list.tsx";
import {
  formatCardType,
  formatCardTypeDescription,
} from "./format-card-type.ts";
import { useCardFormStore } from "./store/card-form-store-context.tsx";

export function CardTypeModal() {
  const cardFormStore = useCardFormStore();
  const { cardForm, cardTypeModal } = cardFormStore;

  if (!cardForm) {
    return null;
  }

  return (
    <CardTypeBottomSheet
      isOpen={cardTypeModal.value}
      onClose={cardTypeModal.setFalse}
      selectedType={cardForm.answerType.value}
      onSelect={(type) => cardForm.answerType.onChange(type)}
    />
  );
}

export function CardTypeBottomSheet({
  isOpen,
  onClose,
  selectedType,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedType: DeckCardDbType["answerType"];
  onSelect: (type: DeckCardDbType["answerType"]) => void;
}) {
  return (
    <BottomSheet
      title={t("review_card_type")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pb-10">
        <RadioList
          selectedId={selectedType}
          onChange={(value) => {
            onSelect(value);
            onClose();
          }}
          options={[
            {
              id: "remember",
              title: formatCardType("remember"),
              description: formatCardTypeDescription("remember"),
            },
            {
              id: "choice_single",
              title: formatCardType("choice_single"),
              description: formatCardTypeDescription("choice_single"),
            },
          ]}
        />
      </div>
    </BottomSheet>
  );
}
