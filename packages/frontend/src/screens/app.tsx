import { MainScreen } from "./deck-list/main-screen.tsx";
import { DeckScreen } from "./deck-review/deck-screen.tsx";
import { ReviewStoreProvider } from "./deck-review/store/review-store-context.tsx";
import { screenStore } from "../store/screen-store.ts";
import { DeckFormScreen } from "./deck-form/deck-form/deck-form-screen.tsx";
import { DeckFormStoreProvider } from "./deck-form/deck-form/store/deck-form-store-context.tsx";
import { QuickAddCardFormPage } from "./deck-form/card-form/quick-add-card-form-page.tsx";
import { VersionWarning } from "./shared/version-warning.tsx";
import { deckListStore } from "../store/deck-list-store.ts";
import { FullScreenLoader } from "../ui/full-screen-loader.tsx";
import {
  PreventTelegramSwipeDownClosingIos,
  useRestoreFullScreenExpand,
} from "../lib/platform/telegram/prevent-telegram-swipe-down-closing.tsx";
import { RepeatAllScreen } from "./deck-review/repeat-all-screen.tsx";
import { DeckCatalog } from "./catalog/deck-catalog.tsx";
import { FolderForm } from "./folder-form/folder-form.tsx";
import { DeckCatalogStoreContextProvider } from "./catalog/store/deck-catalog-store-context.tsx";
import { FolderFormStoreProvider } from "./folder-form/store/folder-form-store-context.tsx";
import { FolderScreen } from "./folder-review/folder-screen.tsx";
import { useSettingsButton } from "../lib/platform/telegram/use-settings-button.ts";
import { UserStatisticsStoreProvider } from "./user-statistics/store/user-statistics-store-context.tsx";
import { UserStatisticsScreen } from "./user-statistics/user-statistics-screen.tsx";
import { UserSettingsLazy } from "./user-settings/user-settings-lazy.tsx";
import { ComponentCatalogPageLazy } from "./component-catalog/component-catalog-page-lazy.tsx";
import { PlansScreen } from "./pro/plans-screen.tsx";
import { FreezeCardsScreenLazy } from "./freeze-cards/freeze-cards-screen-lazy.tsx";
import { AiMassCreationScreen } from "./ai-mass-creation/ai-mass-creation-screen.tsx";
import { AiMassCreationStoreProvider } from "./ai-mass-creation/store/ai-mass-creation-store-provider.tsx";
import { SnackbarProviderWrapper } from "./shared/snackbar/snackbar-provider-wrapper.tsx";
import { Debug } from "./debug/debug.tsx";
import { BrowserMainButton } from "./shared/browser-platform/browser-main-button.tsx";
import { platform } from "../lib/platform/platform.ts";
import { BrowserPlatform } from "../lib/platform/browser/browser-platform.ts";
import { CatalogSettingsScreenLazy } from "./catalog-settings/catalog-settings-screen-lazy.tsx";
import { LoginScreen } from "./login/login-screen.tsx";
import { TelegramPlatform } from "../lib/platform/telegram/telegram-platform.ts";
import { cn } from "../ui/cn.ts";
import { RepeatCustomScreen } from "./repeat-custom/repeat-custom-screen.tsx";
import { useMount } from "../lib/react/use-mount.ts";
import { featuresStore } from "../store/features-store.ts";
import { PaywallModals } from "./shared/feature-preview/paywall-modals.tsx";
import { loadDevtools } from "../lib/eruda/loadDevtools.tsx";

export function App() {
  useRestoreFullScreenExpand();

  useSettingsButton(() => {
    screenStore.goToUserSettings();
  });

  useMount(() => {
    featuresStore.load();
    loadDevtools();
  });

  if (deckListStore.isAppLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div
      className={cn({
        "mt-4": platform instanceof TelegramPlatform && platform.isWeb(),

        [`mx-auto mt-6 max-w-2xl`]:
          platform instanceof BrowserPlatform ||
          (platform instanceof TelegramPlatform && platform.isFullScreen),

        "flex justify-center items-center min-h-[calc(100vh_-_48px)]":
          screenStore.screen.type === "browserLogin",
      })}
    >
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
      {screenStore.screen.type === "reviewCustom" && (
        <PreventTelegramSwipeDownClosingIos>
          <ReviewStoreProvider>
            <RepeatCustomScreen />
          </ReviewStoreProvider>
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
      {screenStore.screen.type === "catalogSettings" && (
        <PreventTelegramSwipeDownClosingIos>
          <CatalogSettingsScreenLazy />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "browserLogin" && <LoginScreen />}
      <BrowserMainButton />

      <PaywallModals />
    </div>
  );
}
