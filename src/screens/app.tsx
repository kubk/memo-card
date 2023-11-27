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
import {
  PreventTelegramSwipeDownClosingIos,
  useRestoreFullScreenExpand,
} from "../lib/telegram/prevent-telegram-swipe-down-closing.tsx";
import { ReviewAllScreen } from "./deck-review/review-all-screen.tsx";

export const App = observer(() => {
  useRestoreFullScreenExpand();

  if (
    deckListStore.isSharedDeckLoading ||
    deckListStore.isDeckRemoving ||
    deckListStore.isReviewAllLoading
  ) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <VersionWarning />
      {screenStore.screen.type === "main" && (
        <PreventTelegramSwipeDownClosingIos>
          <MainScreen />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.isDeckPreviewScreen && (
        <PreventTelegramSwipeDownClosingIos>
          <ReviewStoreProvider>
            <DeckScreen />
          </ReviewStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "reviewAll" && (
        <PreventTelegramSwipeDownClosingIos>
          <ReviewStoreProvider>
            <ReviewAllScreen />
          </ReviewStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "deckForm" && (
        <PreventTelegramSwipeDownClosingIos>
          <DeckFormStoreProvider>
            <DeckFormScreen />
          </DeckFormStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "cardQuickAddForm" && (
        <PreventTelegramSwipeDownClosingIos>
          <QuickAddCardForm />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "userSettings" && (
        <PreventTelegramSwipeDownClosingIos>
          <UserSettingsStoreProvider>
            <UserSettingsMain />
          </UserSettingsStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
    </div>
  );
});
