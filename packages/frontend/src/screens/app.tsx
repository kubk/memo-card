import { MainScreen } from "./deck-list/main-screen.tsx";
import { SearchScreen } from "./global-search/search-screen.tsx";
import { DeckScreen } from "./deck-review/deck-screen.tsx";
import { ReviewStoreProvider } from "./deck-review/store/review-store-context.tsx";
import { screenStore } from "../store/screen-store.ts";
import { DeckFormScreen } from "./deck-form/deck-form/deck-form-screen.tsx";
import { DeckFormStoreProvider } from "./deck-form/deck-form/store/deck-form-store-context.tsx";
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
import { DebugLazy } from "./debug/debug-lazy.tsx";
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
import { CardPreviewScreen } from "./card-preview/card-preview-screen.tsx";
import { SignedIn } from "./shared/signed-in.tsx";
import { AboutScreen } from "./about/about-screen.tsx";

export function App() {
  useRestoreFullScreenExpand();

  useSettingsButton(() => {
    screenStore.goToUserSettings();
  });

  useMount(() => {
    featuresStore.load();
    loadDevtools();

    deckListStore.loadFirstTime(platform.getStartParam());
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

      {screenStore.screen.type === "componentCatalog" && (
        <PreventTelegramSwipeDownClosingIos>
          <ComponentCatalogPageLazy />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "debug" && (
        <PreventTelegramSwipeDownClosingIos>
          <DebugLazy />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "browserLogin" && <LoginScreen />}

      {screenStore.screen.type === "main" && (
        <PreventTelegramSwipeDownClosingIos>
          <MainScreen />
        </PreventTelegramSwipeDownClosingIos>
      )}
      {screenStore.screen.type === "globalSearch" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <SearchScreen />
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.isDeckPreviewScreen && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <ReviewStoreProvider>
              <DeckScreen />
            </ReviewStoreProvider>
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "reviewAll" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <ReviewStoreProvider>
              <RepeatAllScreen />
            </ReviewStoreProvider>
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "reviewCustom" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <ReviewStoreProvider>
              <RepeatCustomScreen />
            </ReviewStoreProvider>
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "folderForm" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <FolderFormStoreProvider>
              <FolderForm />
            </FolderFormStoreProvider>
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "folderPreview" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <ReviewStoreProvider>
              <FolderScreen />
            </ReviewStoreProvider>
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "deckForm" && (
        <SignedIn>
          <DeckFormStoreProvider>
            <DeckFormScreen />
          </DeckFormStoreProvider>
        </SignedIn>
      )}
      {screenStore.screen.type === "cardPreviewId" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <CardPreviewScreen />
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "userSettings" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <UserSettingsLazy />
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "deckCatalog" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <DeckCatalogStoreContextProvider>
              <DeckCatalog />
            </DeckCatalogStoreContextProvider>
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}

      {screenStore.screen.type === "plans" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <PlansScreen />
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "freezeCards" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <FreezeCardsScreenLazy />
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "userStatistics" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <UserStatisticsStoreProvider>
              <UserStatisticsScreen />
            </UserStatisticsStoreProvider>
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "aiMassCreation" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <AiMassCreationStoreProvider>
              <AiMassCreationScreen />
            </AiMassCreationStoreProvider>
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "catalogSettings" && (
        <SignedIn>
          <PreventTelegramSwipeDownClosingIos>
            <CatalogSettingsScreenLazy />
          </PreventTelegramSwipeDownClosingIos>
        </SignedIn>
      )}
      {screenStore.screen.type === "about" && (
        <PreventTelegramSwipeDownClosingIos>
          <AboutScreen />
        </PreventTelegramSwipeDownClosingIos>
      )}

      <BrowserMainButton />

      <PaywallModals />
    </div>
  );
}
