import { Screen } from "../../shared/screen.tsx";
import { LabelGroup } from "../../../ui/label-group.tsx";
import { t } from "../../../translations/t.ts";
import { FormattingSwitcher } from "./formatting-switcher.tsx";
import { WysiwygField } from "../../../ui/wysiwyg-field/wysiwig-field.tsx";
import { Input } from "../../../ui/input.tsx";
import { userStore } from "../../../store/user-store.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { wysiwygStore } from "../../../store/wysiwyg-store.ts";
import { useCardFormStore } from "./store/card-form-store-context.tsx";
import { assert } from "api";
import { BackBottomButton } from "../../shared/back-bottom-button.tsx";

export function CardExample() {
  const cardFormStore = useCardFormStore();
  const { cardForm } = cardFormStore;
  assert(cardForm, "Card form should be available");

  const isCardFormattingOn = userStore.isCardFormattingOn.value;
  const onBack = () => cardFormStore.cardInnerScreen.onChange(null);

  useBackButton(onBack);

  return (
    <Screen title={t("card_field_example_title")}>
      <LabelGroup
        title={t("card_field_example_title")}
        slotRight={<FormattingSwitcher />}
        description={t("card_field_example_hint")}
      >
        {isCardFormattingOn ? (
          <WysiwygField field={cardForm.example} />
        ) : (
          <Input field={cardForm.example} type={"textarea"} rows={2} />
        )}
      </LabelGroup>
      <BackBottomButton
        isVisible={wysiwygStore.bottomSheet === null}
        onClick={onBack}
      />
    </Screen>
  );
}
