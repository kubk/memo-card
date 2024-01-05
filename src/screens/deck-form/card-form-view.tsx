import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { CardFormType } from "./store/deck-form-store.ts";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { t } from "../../translations/t.ts";

type Props = {
  cardForm: CardFormType;
};

export const CardFormView = observer((props: Props) => {
  const { cardForm } = props;

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginBottom: 16,
        position: "relative",
      })}
    >
      <h3 className={css({ textAlign: "center" })}>{t("add_card")}</h3>
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
    </div>
  );
});
