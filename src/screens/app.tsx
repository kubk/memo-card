import { observer } from "mobx-react-lite";
import { MainScreen } from "./deck-list/main-screen.tsx";
import { DeckScreen } from "./deck-review/deck-screen.tsx";
import { ReviewStoreProvider } from "../store/review-store-context.tsx";
import { screenStore } from "../store/screen-store.ts";
import { DeckFormScreen } from "./deck-form/deck-form-screen.tsx";
import { DeckFormStoreProvider } from "../store/deck-form-store-context.tsx";
import { QuickAddCardForm } from "./deck-form/quick-add-card-form.tsx";
import { VersionWarning } from "./shared/version-warning.tsx";
import React from "react";
import { UserSettingsStoreProvider } from "../store/user-settings-store-context.tsx";
import { UserSettingsMain } from "./user-settings/user-settings-main.tsx";
import { deckListStore } from "../store/deck-list-store.ts";
import { FullScreenLoader } from "./deck-list/full-screen-loader.tsx";
import { PreventTelegramSwipeDownClosingIos } from "../lib/telegram/preventTelegramSwipeDownClosing.tsx";

export const App = observer(() => {
  if (deckListStore.isSharedDeckLoading || deckListStore.isDeckRemoving) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <VersionWarning />
      {screenStore.screen.type === "main" && <MainScreen />}
      {screenStore.isDeckPreviewScreen && (
        <ReviewStoreProvider>
          <DeckScreen />
        </ReviewStoreProvider>
      )}
      {screenStore.screen.type === "deckForm" && (
        <DeckFormStoreProvider>
          <DeckFormScreen />
        </DeckFormStoreProvider>
      )}
      {screenStore.screen.type === "cardQuickAddForm" && <QuickAddCardForm />}
      {screenStore.screen.type === "userSettings" && (
        <PreventTelegramSwipeDownClosingIos withScroll={false}>
          <UserSettingsStoreProvider>
            <UserSettingsMain />
          </UserSettingsStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
    </div>
  );
});
