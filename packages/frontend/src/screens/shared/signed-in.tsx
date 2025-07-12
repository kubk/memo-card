import { deckListStore } from "../../store/deck-list-store";
import { FullScreenLoader } from "../../ui/full-screen-loader";

export function SignedIn({ children }: { children: React.ReactNode }) {
  if (!deckListStore.myInfo) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}
