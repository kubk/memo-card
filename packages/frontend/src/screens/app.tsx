import { useState } from "preact/compat";
import { LeaderboardStatisticsScreen } from "./leaderboard/leaderboard-statistics-screen.tsx";
import { MainScreen } from "./deck-list/main-screen.tsx";
import { SearchScreen } from "./global-search/search-screen.tsx";
import { DeckScreen } from "./deck-review/deck-screen.tsx";
import { ReviewStoreProvider } from "./deck-review/store/review-store-context.tsx";
import { screenStore } from "../store/screen-store.ts";
import { DeckFormScreen } from "./deck-form/deck-form/deck-form-screen.tsx";
import { DeckFormStoreProvider } from "./deck-form/deck-form/store/deck-form-store-context.tsx";
import { VersionWarning } from "./shared/version-warning.tsx";
import { deckListStore } from "../store/deck-list-store.ts";
import { appLoaderStore } from "../store/app-loader-store.ts";
import { FullScreenLoader } from "../ui/full-screen-loader.tsx";
import { useRestoreFullScreenExpand } from "../lib/platform/telegram/use-restore-full-screen-expand.ts";
import { RepeatAllScreen } from "./deck-review/repeat-all-screen.tsx";
import { DeckCatalog } from "./catalog/deck-catalog.tsx";
import { FolderForm } from "./folder-form/folder-form.tsx";
import { DeckCatalogStoreContextProvider } from "./catalog/store/deck-catalog-store-context.tsx";
import { FolderFormStoreProvider } from "./folder-form/store/folder-form-store-context.tsx";
import { FolderScreen } from "./folder-review/folder-screen.tsx";
import { useSettingsButton } from "../lib/platform/telegram/use-settings-button.ts";
import { UserStatisticsStoreProvider } from "./user-statistics/store/user-statistics-store-context.tsx";
import {
  UserStatisticsDailyScreen,
  UserStatisticsScreen,
} from "./user-statistics/user-statistics-screen.tsx";
import { UserSettingsStoreProvider } from "./user-settings/store/user-settings-store-context.tsx";
import { UserSettingsScreen } from "./user-settings/user-settings-screen.tsx";
import { McpSettingsWizard } from "./mcp-settings/mcp-settings-wizard.tsx";
import {
  TeacherStatisticsLazy,
  TeacherStatisticsListLazy,
} from "./teacher-statistics/teacher-statistics-lazy.tsx";
import { PlansScreen } from "./pro/plans-screen.tsx";
import { FreezeCardsScreenLazy } from "./freeze-cards/freeze-cards-screen-lazy.tsx";
import { SnackbarProviderWrapper } from "./shared/snackbar/snackbar-provider-wrapper.tsx";
import { BrowserMainButton } from "./shared/browser-platform/browser-main-button.tsx";
import { platform } from "../lib/platform/platform.ts";
import { BrowserPlatform } from "../lib/platform/browser/browser-platform.ts";
import { LoginScreen } from "./login/login-screen.tsx";
import { TelegramPlatform } from "../lib/platform/telegram/telegram-platform.ts";
import { cn } from "../ui/cn.ts";
import { RepeatCustomScreen } from "./repeat-custom/repeat-custom-screen.tsx";
import { useMount } from "../lib/react/use-mount.ts";
import { CardPreviewScreen } from "./card-preview/card-preview-screen.tsx";
import { SignedIn } from "./shared/signed-in.tsx";
import { AboutScreen } from "./about/about-screen.tsx";
import { CardList } from "./deck-form/deck-form/card-list.tsx";
import { SpeakingCards } from "./deck-form/deck-form/speaking-cards.tsx";
import { AnkiImportScreen } from "./anki-import/anki-import-screen.tsx";
import { userStore } from "../store/user-store.ts";
import { RouteScreenContainer } from "../lib/react/route-screen-container.tsx";
import { DeleteItemModalContainer } from "./shared/delete-item-modal.tsx";
import { BottomNavigation } from "../ui/bottom-navigation.tsx";
import { LeaderboardScreen } from "./leaderboard/leaderboard-screen.tsx";
import { SharedDeckNotFoundScreen } from "./error-screen/shared-deck-not-found-screen.tsx";
import { McpWizardStore } from "./mcp-settings/store/mcp-wizard-store.ts";

export function App() {
  useRestoreFullScreenExpand();

  useSettingsButton(() => {
    screenStore.goToUserSettings();
  });

  useMount(() => {
    deckListStore.loadFirstTime(platform.getStartParam());
  });

  if (appLoaderStore.isAppLoading) {
    return <FullScreenLoader />;
  }

  const isTelegramMobile =
    platform instanceof TelegramPlatform && platform.isMobile;
  const isDesktopWidth =
    platform instanceof BrowserPlatform ||
    (platform instanceof TelegramPlatform &&
      platform.isFullScreen &&
      !isTelegramMobile);

  return (
    <div
      className={cn(
        "relative h-[var(--tg-viewport-height,100vh)] overflow-hidden [--app-top-offset:12px]",
        isTelegramMobile &&
          "[--app-top-offset:calc(var(--tg-content-safe-area-inset-top,0px)_+_4px)]",
        isDesktopWidth && "mx-auto max-w-2xl",
      )}
    >
      <SnackbarProviderWrapper />
      <BottomNavigation>
        <RouteScreenContainer>
          <VersionWarning />

          {screenStore.screen.type === "browserLogin" && <LoginScreen />}

          {screenStore.screen.type === "main" && <MainScreen />}
          {screenStore.screen.type === "leaderboardStatistics" && (
            <SignedIn>
              <LeaderboardStatisticsScreen />
            </SignedIn>
          )}
          {screenStore.screen.type === "leaderboard" && (
            <SignedIn>
              <LeaderboardScreen />
            </SignedIn>
          )}
          {screenStore.screen.type === "globalSearch" && (
            <SignedIn>
              <SearchScreen />
            </SignedIn>
          )}
          {screenStore.screen.type === "deckPreview" && (
            <SignedIn>
              <ReviewStoreProvider>
                <DeckScreen />
              </ReviewStoreProvider>
            </SignedIn>
          )}
          {screenStore.screen.type === "reviewAll" && (
            <SignedIn>
              <ReviewStoreProvider>
                <RepeatAllScreen />
              </ReviewStoreProvider>
            </SignedIn>
          )}
          {screenStore.screen.type === "reviewCustom" && (
            <SignedIn>
              <ReviewStoreProvider>
                <RepeatCustomScreen />
              </ReviewStoreProvider>
            </SignedIn>
          )}
          {screenStore.screen.type === "folderForm" && (
            <SignedIn>
              <FolderFormStoreProvider>
                <FolderForm />
              </FolderFormStoreProvider>
            </SignedIn>
          )}
          {screenStore.screen.type === "folderPreview" && (
            <SignedIn>
              <ReviewStoreProvider>
                <FolderScreen />
              </ReviewStoreProvider>
            </SignedIn>
          )}
          {screenStore.screen.type === "deckForm" && (
            <SignedIn>
              <DeckFormStoreProvider>
                <DeckFormScreen />
              </DeckFormStoreProvider>
            </SignedIn>
          )}
          {screenStore.screen.type === "ankiImport" && (
            <SignedIn>
              <AnkiImportScreen />
            </SignedIn>
          )}
          {screenStore.screen.type === "cardList" && (
            <SignedIn>
              <CardList />
            </SignedIn>
          )}
          {screenStore.screen.type === "cardListPreview" && (
            <SignedIn>
              <CardList />
            </SignedIn>
          )}
          {screenStore.screen.type === "speakingCards" && (
            <SignedIn>
              <DeckFormStoreProvider>
                <SpeakingCards />
              </DeckFormStoreProvider>
            </SignedIn>
          )}
          {screenStore.screen.type === "cardPreviewId" && (
            <SignedIn>
              <CardPreviewScreen />
            </SignedIn>
          )}
          {screenStore.screen.type === "userSettings" && (
            <SignedIn>
              <UserSettingsStoreProvider>
                <UserSettingsScreen />
              </UserSettingsStoreProvider>
            </SignedIn>
          )}
          {screenStore.screen.type === "mcpSettings" && (
            <SignedIn>
              <McpSettingsWizardRoute />
            </SignedIn>
          )}
          {screenStore.screen.type === "deckCatalog" && (
            <SignedIn>
              <DeckCatalogStoreContextProvider>
                <DeckCatalog />
              </DeckCatalogStoreContextProvider>
            </SignedIn>
          )}

          {screenStore.screen.type === "plans" && (
            <SignedIn>
              {screenStore.screen.planType === "pro" && userStore.isPaid ? (
                <McpSettingsWizardRoute />
              ) : (
                <PlansScreen />
              )}
            </SignedIn>
          )}
          {screenStore.screen.type === "freezeCards" && (
            <SignedIn>
              <FreezeCardsScreenLazy />
            </SignedIn>
          )}
          {(screenStore.screen.type === "userStatistics" ||
            screenStore.screen.type === "userStatisticsDaily") && (
            <SignedIn>
              <UserStatisticsStoreProvider>
                {screenStore.screen.type === "userStatisticsDaily" ? (
                  <UserStatisticsDailyScreen />
                ) : (
                  <UserStatisticsScreen />
                )}
              </UserStatisticsStoreProvider>
            </SignedIn>
          )}
          {screenStore.screen.type === "teacherStatistics" && (
            <SignedIn>
              {userStore.isTeacherPaid ? (
                <TeacherStatisticsLazy />
              ) : (
                <MainScreen />
              )}
            </SignedIn>
          )}
          {screenStore.screen.type === "teacherStatisticsList" && (
            <SignedIn>
              {userStore.isTeacherPaid ? (
                <TeacherStatisticsListLazy />
              ) : (
                <MainScreen />
              )}
            </SignedIn>
          )}
          {screenStore.screen.type === "about" && <AboutScreen />}
          {screenStore.screen.type === "sharedDeckNotFound" && (
            <SignedIn>
              <SharedDeckNotFoundScreen />
            </SignedIn>
          )}
        </RouteScreenContainer>
      </BottomNavigation>
      <BrowserMainButton />

      <DeleteItemModalContainer />
    </div>
  );
}

function McpSettingsWizardRoute() {
  const [store] = useState(() => new McpWizardStore());
  return <McpSettingsWizard store={store} />;
}
