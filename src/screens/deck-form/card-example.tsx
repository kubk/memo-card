import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { Label } from "../../ui/label.tsx";
import { t } from "../../translations/t.ts";
import { FormattingSwitcher } from "./formatting-switcher.tsx";
import { WysiwygField } from "../../ui/wysiwyg-field/wysiwig-field.tsx";
import { Input } from "../../ui/input.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import React from "react";
import { userStore } from "../../store/user-store.ts";
import { CardFormType } from "./store/deck-form-store.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";

type Props = {
  cardForm: CardFormType;
  onBack: () => void;
};

export const CardExample = observer((props: Props) => {
  const isCardFormattingOn = userStore.isCardFormattingOn.value;
  const { cardForm, onBack } = props;

  useBackButton(() => {
    onBack();
  });

  useMainButton(t("go_back"), () => {
    onBack();
  });

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
});
