import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { CardFormType } from "../../store/deck-form-store.ts";

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
        gap: 6,
        marginBottom: 16,
        position: "relative",
      })}
    >
      <h3 className={css({ textAlign: "center" })}>Add card</h3>
      <Label text={"Front"} isRequired>
        <Input field={cardForm.front} rows={5} type={"textarea"} />
      </Label>

      <Label text={"Back"} isRequired>
        <Input field={cardForm.back} rows={5} type={"textarea"} />
      </Label>

      <Label text={"Example / Note"}>
        <Input field={cardForm.example} rows={3} type={"textarea"} />
      </Label>
    </div>
  );
});
