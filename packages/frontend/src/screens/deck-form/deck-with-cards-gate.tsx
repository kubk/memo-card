import { ReactNode } from "preact/compat";
import { deckListStore } from "../../store/deck-list-store.ts";
import { deckDetailsStore } from "../../store/deck-details-store.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { ErrorScreen } from "../error-screen/error-screen.tsx";
import { DeckNotFoundScreen } from "../error-screen/deck-not-found-screen.tsx";
import { isTrpcNotFoundError } from "../../api/is-trpc-not-found-error.ts";

export function DeckWithCardsGate({
  deckId,
  children,
}: {
  deckId?: number;
  children: ReactNode;
}) {
  const deck = deckId ? deckListStore.searchDeckWithCardsById(deckId) : null;
  const query = deckId ? deckDetailsStore.getQuery(deckId) : null;
  const isLoading = !!deckId && !deck && !query?.error;

  useProgress(() => isLoading);

  if (!deckId || deck) {
    return <>{children}</>;
  }

  if (isLoading) {
    return null;
  }

  return isTrpcNotFoundError(query?.error) ? (
    <DeckNotFoundScreen />
  ) : (
    <ErrorScreen />
  );
}
