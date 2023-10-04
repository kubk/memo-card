import { observer } from "mobx-react-lite";
import { assert } from "../../lib/typescript/assert.ts";
import { css } from "@emotion/css";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import React from "react";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useDeckFormStore } from "../../store/deck-form-store-context.tsx";
import { BackIcon } from "./back-icon.tsx";
import WebApp from "@twa-dev/sdk";

export const CardForm = observer(() => {
  const deckFormStore = useDeckFormStore();
  const cardForm = deckFormStore.cardForm;
  assert(cardForm);

  useMainButton("Save", () => {
    deckFormStore.saveCardForm();
  });

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
      <BackIcon
        onClick={() => {
          WebApp.showConfirm(
            "Quit editing card without saving?",
            (confirmed) => {
              if (confirmed) {
                deckFormStore.quitCardForm();
              }
            },
          );
        }}
      />
      <h3 className={css({ textAlign: "center" })}>Add card</h3>
      <Label text={"Title"}>
        <Input {...cardForm.front.props} rows={7} type={"textarea"} />
      </Label>

      <Label text={"Description"}>
        <Input {...cardForm.back.props} rows={7} type={"textarea"} />
      </Label>
    </div>
  );
});
