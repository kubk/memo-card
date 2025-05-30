import { DeckForm } from "./deck-form.tsx";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { CardList } from "./card-list.tsx";
import { CardFormWrapper } from "../card-form/card-form-wrapper.tsx";
import { PreventTelegramSwipeDownClosingIos } from "../../../lib/platform/telegram/prevent-telegram-swipe-down-closing.tsx";
import { SpeakingCards } from "./speaking-cards.tsx";
import { CardInputModeScreen } from "../../card-input-mode/card-input-mode-screen.tsx";

export function DeckFormScreen() {
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

  if (deckFormStore.deckFormScreen === "cardInputMode") {
    return (
      <PreventTelegramSwipeDownClosingIos>
        <CardInputModeScreen deckFormStore={deckFormStore} />
      </PreventTelegramSwipeDownClosingIos>
    );
  }

  if (deckFormStore.deckFormScreen === "deckForm") {
    // No PreventTelegramSwipeDownClosingIos because the description textarea usually requires scroll
    return <DeckForm />;
  }

  return deckFormStore.deckFormScreen satisfies never;
}
