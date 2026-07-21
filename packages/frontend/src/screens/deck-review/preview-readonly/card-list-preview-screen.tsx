import { assert } from "api";
import { useState } from "react";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { ErrorScreen } from "../../error-screen/error-screen.tsx";
import { CardList } from "../../deck-form/deck-form/card-list.tsx";
import { DeckFormStoreProvider } from "../../deck-form/deck-form/store/deck-form-store-context.tsx";
import { DeckScreenStore } from "../store/deck-screen-store.ts";

export function CardListPreviewScreen() {
  const route = screenStore.screen;
  assert(
    route.type === "cardListPreview",
    "CardListPreviewScreen requires a card list preview route",
  );
  const [store] = useState(() => new DeckScreenStore(route.deckId));

  useProgress(() => store.isInitialLoading);

  if (store.detailsQuery.error) {
    return <ErrorScreen />;
  }

  if (store.isInitialLoading && !route.state?.deck) {
    return null;
  }

  const deck = store.deck;
  if (!deck) {
    return null;
  }

  return (
    <DeckFormStoreProvider deck={deck}>
      <CardList
        readOnly
        onCardClick={(cardId) => {
          screenStore.push({
            type: "cardPreviewId",
            cardId,
            deckId: deck.id,
          });
        }}
      />
    </DeckFormStoreProvider>
  );
}
