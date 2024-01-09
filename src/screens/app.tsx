import { observer } from "mobx-react-lite";
import { MainScreen } from "./deck-list/main-screen.tsx";
import { DeckScreen } from "./deck-review/deck-screen.tsx";
import { ReviewStoreProvider } from "./deck-review/store/review-store-context.tsx";
import { screenStore } from "../store/screen-store.ts";
import { DeckFormScreen } from "./deck-form/deck-form-screen.tsx";
import { DeckFormStoreProvider } from "./deck-form/store/deck-form-store-context.tsx";
import { QuickAddCardForm } from "./deck-form/quick-add-card-form.tsx";
import { VersionWarning } from "./shared/version-warning.tsx";
import React, { useMemo, useState } from "react";
import { UserSettingsStoreProvider } from "./user-settings/store/user-settings-store-context.tsx";
import { UserSettingsMain } from "./user-settings/user-settings-main.tsx";
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
import { ShareDeckScreen } from "./share-deck/share-deck-screen.tsx";
import { ShareDeckStoreProvider } from "./share-deck/store/share-deck-store-context.tsx";
import { FolderFormStoreProvider } from "./folder-form/store/folder-form-store-context.tsx";
import { FolderScreen } from "./folder-review/folder-screen.tsx";
import {
  BtnBold,
  BtnItalic,
  createButton,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";

const BtnAlignCenter = createButton("Decrease size", "-", "decreaseFontSize");

export function App() {
  const [value, setValue] = useState("simple text");
  const [link, setLink] = useState("");
  const [isOpened, setIsOpened] = useState(false);

  // @ts-ignore
  function onChange(e) {
    setValue(e.target.value);
  }

  const BtnLink2 = useMemo(
    () =>
      createButton("Link", "🔗", ({ $selection }) => {
        if ($selection?.nodeName === "A") {
          document.execCommand("unlink");
        } else {
          setIsOpened(true);
        }
      }),
    [],
  );

  return (
    <EditorProvider>
      <Editor value={value} onChange={onChange}>
        <Toolbar>
          <BtnBold />
          <BtnItalic />
          <BtnLink2 />
          <BtnAlignCenter />
        </Toolbar>
      </Editor>
      {JSON.stringify(value, null, 2)}
      {isOpened && (
        <div>
          <input
            value={link}
            onChange={(e: any) => {
              setLink(e.target.value);
            }}
          />
          <button
            onClick={() => {
              console.log(link);
              document.execCommand("createLink", false, link);
              setIsOpened(false);
            }}
          >
            OK
          </button>
        </div>
      )}
    </EditorProvider>
  );
}

export const App2 = observer(() => {
  useRestoreFullScreenExpand();

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
          <ShareDeckStoreProvider>
            <ShareDeckScreen />
          </ShareDeckStoreProvider>
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
      {screenStore.screen.type === "deckCatalog" && (
        <PreventTelegramSwipeDownClosingIos>
          <DeckCatalogStoreContextProvider>
            <DeckCatalog />
          </DeckCatalogStoreContextProvider>
        </PreventTelegramSwipeDownClosingIos>
      )}
    </div>
  );
});
