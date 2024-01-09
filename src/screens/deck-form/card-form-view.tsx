import { observer } from "mobx-react-lite";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { CardFormType } from "./store/deck-form-store.ts";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { t } from "../../translations/t.ts";
import { Screen } from "../shared/screen.tsx";
import { CenteredUnstyledButton } from "../../ui/centered-unstyled-button.tsx";
import { isFormValid } from "../../lib/mobx-form/form-has-error.ts";

type Props = {
  cardForm: CardFormType;
  onPreviewClick: () => void;
};

export const CardFormView = observer((props: Props) => {
  const { cardForm, onPreviewClick } = props;

  return (
    <Screen title={cardForm ? t("edit_card") : t("add_card")}>
      <Label text={t("card_front_title")} isRequired>
        <Input field={cardForm.front} rows={3} type={"textarea"} />
        <HintTransparent>{t("card_front_side_hint")}</HintTransparent>
      </Label>

      <Label text={t("card_back_title")} isRequired>
        <Input field={cardForm.back} rows={3} type={"textarea"} />
        <HintTransparent>{t("card_back_side_hint")}</HintTransparent>
      </Label>

      <Label text={t("card_field_example_title")}>
        <Input field={cardForm.example} rows={2} type={"textarea"} />
        <HintTransparent>{t("card_field_example_hint")}</HintTransparent>
      </Label>

      {isFormValid(cardForm) && (
        <CenteredUnstyledButton onClick={onPreviewClick}>
          {t("card_preview")}
        </CenteredUnstyledButton>
      )}
    </Screen>
  );
});
