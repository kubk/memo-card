import { SharedDeckNotFoundScreen } from "../src/screens/error-screen/shared-deck-not-found-screen.tsx";
import { BrowserMainButton } from "../src/screens/shared/browser-platform/browser-main-button.tsx";

export function SharedDeckNotFoundPlayground() {
  return (
    <>
      <div className="h-full w-full overflow-y-auto bg-secondary-bg text-text">
        <SharedDeckNotFoundScreen />
      </div>
      <BrowserMainButton />
    </>
  );
}
