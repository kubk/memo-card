import { Screen } from "../../shared/screen.tsx";
import { Label } from "../../../ui/label.tsx";
import { t } from "../../../translations/t.ts";
import { FormattingSwitcher } from "./formatting-switcher.tsx";
import { WysiwygField } from "../../../ui/wysiwyg-field/wysiwig-field.tsx";
import { Input } from "../../../ui/input.tsx";
import { HintTransparent } from "../../../ui/hint-transparent.tsx";
import { userStore } from "../../../store/user-store.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { wysiwygStore } from "../../../store/wysiwyg-store.ts";
import { useCardFormStore } from "./store/card-form-store-context.tsx";
import { assert } from "api";

export function CardExample() {
  const cardFormStore = useCardFormStore();
  const { cardForm } = cardFormStore;
  assert(cardForm, "Card form should be available");

  const isCardFormattingOn = userStore.isCardFormattingOn.value;
  const onBack = () => cardFormStore.cardInnerScreen.onChange(null);

  useBackButton(onBack);

  useMainButton(t("go_back"), onBack, () => wysiwygStore.bottomSheet === null);

  return (
    <Screen title={t("card_field_example_title")}>
      <Label
        isPlain
        text={t("card_field_example_title")}
        slotRight={<FormattingSwitcher />}
      >
        {isCardFormattingOn ? (
          <WysiwygField field={cardForm.example} />
        ) : (
          <Input field={cardForm.example} type={"textarea"} rows={2} />
        )}
        <HintTransparent>{t("card_field_example_hint")}</HintTransparent>
      </Label>
    </Screen>
  );
}
