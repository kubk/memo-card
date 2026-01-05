import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
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
    <BottomSheet isOpen={cardTypeModal.value} onClose={cardTypeModal.setFalse}>
      <div className="pb-10">
        <RadioList
          selectedId={cardForm.answerType.value}
          onChange={(value) => {
            cardForm.answerType.onChange(value);
            cardTypeModal.setFalse();
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
