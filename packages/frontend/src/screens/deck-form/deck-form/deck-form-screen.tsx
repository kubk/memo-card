import { DeckForm } from "./deck-form.tsx";
import { useDeckFormStore } from "./store/deck-form-store-context.tsx";
import { CardFormWrapper } from "../card-form/card-form-wrapper.tsx";
import { CardFormStoreProvider } from "../card-form/store/card-form-store-context.tsx";
import { PreventTelegramSwipeDownClosingIos } from "../../../lib/platform/telegram/prevent-telegram-swipe-down-closing.tsx";

export function DeckFormScreen() {
  const deckFormStore = useDeckFormStore();

  if (deckFormStore.deckFormScreen === "cardForm") {
    return (
      <PreventTelegramSwipeDownClosingIos>
        <CardFormStoreProvider>
          <CardFormWrapper />
        </CardFormStoreProvider>
      </PreventTelegramSwipeDownClosingIos>
    );
  }

  if (deckFormStore.deckFormScreen === "deckForm") {
    // No PreventTelegramSwipeDownClosingIos because the description textarea usually requires scroll
    return <DeckForm />;
  }

  return deckFormStore.deckFormScreen satisfies never;
}
