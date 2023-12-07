import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { CardFormType } from "../../store/deck-form-store.ts";
import { HintTransparent } from "../../ui/hint-transparent.tsx";

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
      <h3 className={css({ textAlign: "center" })}>Add card</h3>
      <Label text={"Front side"} isRequired>
        <Input field={cardForm.front} rows={3} type={"textarea"} />
        <HintTransparent>The prompt or question you'll see</HintTransparent>
      </Label>

      <Label text={"Back side"} isRequired>
        <Input field={cardForm.back} rows={3} type={"textarea"} />
        <HintTransparent>The response you need to provide</HintTransparent>
      </Label>

      <Label text={"Example"}>
        <Input field={cardForm.example} rows={2} type={"textarea"} />
        <HintTransparent>Optional additional information</HintTransparent>
      </Label>
    </div>
  );
});
