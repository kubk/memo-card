import { observer } from "mobx-react-lite";
import { MainScreen } from "./deck-list/main-screen.tsx";
import { DeckScreen } from "./deck-review/deck-screen.tsx";
import { ReviewStoreProvider } from "./deck-review/store/review-store-context.tsx";
import { screenStore } from "../store/screen-store.ts";
import { DeckFormScreen } from "./deck-form/deck-form-screen.tsx";
import { DeckFormStoreProvider } from "./deck-form/store/deck-form-store-context.tsx";
import { QuickAddCardFormPage } from "./deck-form/quick-add-card-form-page.tsx";
import { VersionWarning } from "./shared/version-warning.tsx";
import React from "react";
import { deckListStore } from "../store/deck-list-store.ts";
import { FullScreenLoader } from "../ui/full-screen-loader.tsx";
import {
  PreventTelegramSwipeDownClosingIos,
  useRestoreFullScreenExpand,
} from "../lib/telegram/prevent-telegram-swipe-down-closing.tsx";
import { RepeatAllScreen } from "./deck-review/repeat-all-screen.tsx";
import { DeckCatalog } from "./deck-catalog/deck-catalog.tsx";
import { DeckOrFolderChoose } from "./deck-or-folder-choose/deck-or-folder-choose.tsx";
import { FolderForm } from "./folder-form/folder-form.tsx";
import { DeckCatalogStoreContextProvider } from "./deck-catalog/store/deck-catalog-store-context.tsx";
import { FolderFormStoreProvider } from "./folder-form/store/folder-form-store-context.tsx";
import { FolderScreen } from "./folder-review/folder-screen.tsx";
import { useSettingsButton } from "../lib/telegram/use-settings-button.ts";
import { UserStatisticsStoreProvider } from "./user-statistics/store/user-statistics-store-context.tsx";
import { UserStatisticsScreen } from "./user-statistics/user-statistics-screen.tsx";
import { UserSettingsLazy } from "./user-settings/user-settings-lazy.tsx";
import { ComponentCatalogPageLazy } from "./component-catalog/component-catalog-page-lazy.tsx";
import {
  ShareDeckScreenLazy,
  ShareFolderScreenLazy,
} from "./share-deck/share-deck-screen-lazy.tsx";
import { PlansScreen } from "./plans/plans-screen.tsx";

export const App = observer(() => {
  useRestoreFullScreenExpand();

  useSettingsButton(() => {
    screenStore.go({ type: "userSettings" });
  });

  if (deckListStore.isFullScreenLoaderVisible) {
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
        <PreventTelegramSwipeDownClosingIos>
          <DeckFormStoreProvider>
            <DeckFormScreen />
          </DeckFormStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
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
      {screenStore.screen.type === "userStatistics" && (
        <PreventTelegramSwipeDownClosingIos>
          <UserStatisticsStoreProvider>
            <UserStatisticsScreen />
          </UserStatisticsStoreProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
    </div>
  );
});
