import React from "react";
import { observer } from "mobx-react-lite";
import { DeckForm } from "./deck-form.tsx";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { CardList } from "./card-list.tsx";
import { CardFormWrapper } from "../card-form/card-form-wrapper.tsx";
import { PreventTelegramSwipeDownClosingIos } from "../../../lib/platform/telegram/prevent-telegram-swipe-down-closing.tsx";
import { SpeakingCards } from "./speaking-cards.tsx";

export const DeckFormScreen = observer(() => {
  const deckFormStore = useDeckFormStore();

  if (deckFormStore.deckFormScreen === "cardList") {
    return (
      <PreventTelegramSwipeDownClosingIos>
        <CardList />
      </PreventTelegramSwipeDownClosingIos>
    );
  }

  if (deckFormStore.deckFormScreen === "cardForm") {
    return (
      <PreventTelegramSwipeDownClosingIos>
        <CardFormWrapper cardFormStore={deckFormStore} />
      </PreventTelegramSwipeDownClosingIos>
    );
  }

  if (deckFormStore.deckFormScreen === "speakingCards") {
    return (
      <PreventTelegramSwipeDownClosingIos>
        <SpeakingCards />
      </PreventTelegramSwipeDownClosingIos>
    );
  }

  // No PreventTelegramSwipeDownClosingIos because the description textarea usually requires scroll
  return <DeckForm />;
});
