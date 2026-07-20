import { assert } from "api";
import { useState } from "react";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { screenStore } from "../../../store/screen-store.ts";
import { ErrorScreen } from "../../error-screen/error-screen.tsx";
import { DeckScreenStore } from "../store/deck-screen-store.ts";
import { CardListWithPreviewReadonly } from "./card-list-with-preview-readonly.tsx";

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

  const deck = store.deck;
  if (!deck) {
    return null;
  }

  return (
    <CardListWithPreviewReadonly
      onBack={screenStore.back}
      deck={deck}
      cards={deck.deckCards}
      subtitle={deck.name}
    />
  );
}
