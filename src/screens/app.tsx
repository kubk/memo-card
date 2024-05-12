import { observer } from "mobx-react-lite";
import { MainScreen } from "./deck-list/main-screen.tsx";
import { DeckScreen } from "./deck-review/deck-screen.tsx";
import { ReviewStoreProvider } from "./deck-review/store/review-store-context.tsx";
import { screenStore } from "../store/screen-store.ts";
import { DeckFormScreen } from "./deck-form/deck-form/deck-form-screen.tsx";
import { DeckFormStoreProvider } from "./deck-form/deck-form/store/deck-form-store-context.tsx";
import { QuickAddCardFormPage } from "./deck-form/card-form/quick-add-card-form-page.tsx";
import { VersionWarning } from "./shared/version-warning.tsx";
import React from "react";
import { deckListStore } from "../store/deck-list-store.ts";
import { FullScreenLoader } from "../ui/full-screen-loader.tsx";
import {
  PreventTelegramSwipeDownClosingIos,
  useRestoreFullScreenExpand,
} from "../lib/platform/telegram/prevent-telegram-swipe-down-closing.tsx";
import { RepeatAllScreen } from "./deck-review/repeat-all-screen.tsx";
import { DeckCatalog } from "./deck-catalog/deck-catalog.tsx";
import { DeckOrFolderChoose } from "./deck-or-folder-choose/deck-or-folder-choose.tsx";
import { FolderForm } from "./folder-form/folder-form.tsx";
import { DeckCatalogStoreContextProvider } from "./deck-catalog/store/deck-catalog-store-context.tsx";
import { FolderFormStoreProvider } from "./folder-form/store/folder-form-store-context.tsx";
import { FolderScreen } from "./folder-review/folder-screen.tsx";
import { useSettingsButton } from "../lib/platform/telegram/use-settings-button.ts";
import { UserStatisticsStoreProvider } from "./user-statistics/store/user-statistics-store-context.tsx";
import { UserStatisticsScreen } from "./user-statistics/user-statistics-screen.tsx";
import { UserSettingsLazy } from "./user-settings/user-settings-lazy.tsx";
import { ComponentCatalogPageLazy } from "./component-catalog/component-catalog-page-lazy.tsx";
import {
  ShareDeckScreenLazy,
  ShareFolderScreenLazy,
} from "./share-deck/share-deck-screen-lazy.tsx";
import { PlansScreen } from "./plans/plans-screen.tsx";
import { isRunningWithinTelegram } from "../lib/platform/is-running-within-telegram.ts";
import { FreezeCardsScreenLazy } from "./freeze-cards/freeze-cards-screen-lazy.tsx";
import { AiMassCreationScreen } from "./ai-mass-creation/ai-mass-creation-screen.tsx";
import { AiMassCreationStoreProvider } from "./ai-mass-creation/store/ai-mass-creation-store-provider.tsx";

import { SnackbarProviderWrapper } from "./shared/snackbar/snackbar-provider-wrapper.tsx";
import { Debug } from "./debug/debug.tsx";
import { BrowserHeader } from "./shared/browser-platform/browser-header.tsx";
import { BrowserMainButton } from "./shared/browser-platform/browser-main-button.tsx";
import { CardInputModeScreen } from "./card-input-mode/card-input-mode-screen.tsx";

export const App = observer(() => {
  useRestoreFullScreenExpand();

  if (import.meta.env.PROD && !isRunningWithinTelegram()) {
    return <div>This app can only be run within Telegram.</div>;
  }

  useSettingsButton(() => {
    if (screenStore.screen.type === "userSettings") {
      // Fixes strange Telegram error that leads to blank screen if opening settings twice
      return;
    }
    screenStore.go({ type: "userSettings" });
  });

  if (deckListStore.isAppLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <BrowserHeader />
      <VersionWarning />
      <SnackbarProviderWrapper />
      {screenStore.screen.type === "main" && (
        <PreventTelegramSwipeDownClosingIos>
          <MainScreen />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "debug" && (
        <PreventTelegramSwipeDownClosingIos>
          <Debug />
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
            <RepeatAllScreen />
          </ReviewStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "deckOrFolderChoose" && (
        <PreventTelegramSwipeDownClosingIos>
          <DeckOrFolderChoose />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "folderForm" && (
        <PreventTelegramSwipeDownClosingIos>
          <FolderFormStoreProvider>
            <FolderForm />
          </FolderFormStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "folderPreview" && (
        <PreventTelegramSwipeDownClosingIos>
          <ReviewStoreProvider>
            <FolderScreen />
          </ReviewStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "deckForm" && (
        <DeckFormStoreProvider>
          <DeckFormScreen />
        </DeckFormStoreProvider>
      )}
      {screenStore.screen.type === "shareDeck" && (
        <PreventTelegramSwipeDownClosingIos>
          <ShareDeckScreenLazy />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "shareFolder" && (
        <PreventTelegramSwipeDownClosingIos>
          <ShareFolderScreenLazy />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "cardQuickAddForm" && (
        <PreventTelegramSwipeDownClosingIos>
          <QuickAddCardFormPage />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "userSettings" && (
        <PreventTelegramSwipeDownClosingIos>
          <UserSettingsLazy />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "deckCatalog" && (
        <PreventTelegramSwipeDownClosingIos>
          <DeckCatalogStoreContextProvider>
            <DeckCatalog />
          </DeckCatalogStoreContextProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "componentCatalog" && (
        <PreventTelegramSwipeDownClosingIos>
          <ComponentCatalogPageLazy />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "plans" && (
        <PreventTelegramSwipeDownClosingIos>
          <PlansScreen />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "freezeCards" && (
        <PreventTelegramSwipeDownClosingIos>
          <FreezeCardsScreenLazy />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "userStatistics" && (
        <PreventTelegramSwipeDownClosingIos>
          <UserStatisticsStoreProvider>
            <UserStatisticsScreen />
          </UserStatisticsStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "aiMassCreation" && (
        <PreventTelegramSwipeDownClosingIos>
          <AiMassCreationStoreProvider>
            <AiMassCreationScreen />
          </AiMassCreationStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "cardInputMode" && (
        <PreventTelegramSwipeDownClosingIos>
          <CardInputModeScreen />
        </PreventTelegramSwipeDownClosingIos>
      )}
      <BrowserMainButton />
    </div>
  );
});
