import { observer } from "mobx-react-lite";
import WebApp from "@twa-dev/sdk";
import { css } from "@emotion/css";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import { theme } from "../../ui/theme.tsx";
import { Button } from "../../ui/button.tsx";
import React from "react";
import { useMainButton } from "../../lib/telegram/use-main-button.tsx";
import { useDeckFormStore } from "../../store/deck-form-store-context.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { BackIcon } from "./back-icon.tsx";
import { assert } from "../../lib/typescript/assert.ts";
import { useMount } from "../../lib/react/use-mount.ts";

export const DeckForm = observer(() => {
  const deckFormStore = useDeckFormStore();

  useMount(() => {
    deckFormStore.loadForm();
  });

  useMainButton("Save", () => {
    assert(deckFormStore.form);
    if (deckFormStore.form.cards.length === 0) {
      WebApp.showAlert("Please add at least 1 card to create a deck");
      return;
    }
    deckFormStore.saveDeckForm(
      () => WebApp.MainButton.showProgress(),
      () => WebApp.MainButton.hideProgress(),
    );
  });

  if (!deckFormStore.form) {
    return null;
  }

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
        marginBottom: 16,
      })}
    >
      <BackIcon
        onClick={() => {
          WebApp.showConfirm("Cancel adding deck and quit?", (confirmed) => {
            if (confirmed) {
              screenStore.navigateToMain();
            }
          });
        }}
      />
      <h3 className={css({ textAlign: "center" })}>
        {screenStore.deckFormId ? "Edit deck" : "Add deck"}
      </h3>
      <Label text={"Title"}>
        <Input {...deckFormStore.form.title.props} />
      </Label>

      <Label text={"Description"}>
        <Input
          {...deckFormStore.form.description.props}
          rows={5}
          type={"textarea"}
        />
      </Label>

      {deckFormStore.form.cards.map((cardForm, i) => (
        <div
          onClick={() => {
            deckFormStore.editCardForm(i);
          }}
          key={i}
          className={css({
            cursor: "pointer",
            backgroundColor: theme.secondaryBgColor,
            borderRadius: 8,
            padding: 12,
          })}
        >
          <div>{cardForm.front.value}</div>
          <div className={css({ color: theme.hintColor })}>
            {cardForm.back.value}
          </div>
        </div>
      ))}

      <Button
        onClick={() => {
          deckFormStore.openNewCardForm();
        }}
      >
        Add card
      </Button>
    </div>
  );
});
