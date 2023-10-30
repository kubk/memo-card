import { observer } from "mobx-react-lite";
import { MainScreen } from "./deck-list/main-screen.tsx";
import { DeckScreen } from "./deck-review/deck-screen.tsx";
import { ReviewStoreProvider } from "../store/review-store-context.tsx";
import { Screen, screenStore } from "../store/screen-store.ts";
import { DeckFormScreen } from "./deck-form/deck-form-screen.tsx";
import { DeckFormStoreProvider } from "../store/deck-form-store-context.tsx";
import { QuickAddCardForm } from "./deck-form/quick-add-card-form.tsx";

export const App = observer(() => {
  return (
    <div>
      {screenStore.screen === Screen.Main && <MainScreen />}
      {screenStore.isDeckPreviewScreen && (
        <ReviewStoreProvider>
          <DeckScreen />
        </ReviewStoreProvider>
      )}
      {screenStore.screen === Screen.DeckForm && (
        <DeckFormStoreProvider>
          <DeckFormScreen />
        </DeckFormStoreProvider>
      )}
      {screenStore.screen === Screen.CardQuickAddForm && <QuickAddCardForm />}
    </div>
  );
});
