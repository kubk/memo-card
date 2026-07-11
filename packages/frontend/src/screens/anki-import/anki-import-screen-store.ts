import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../../api/trpc-api.ts";
import { makeMutation } from "../../lib/mobx-query-lite/make-mutation.ts";
import { showAlert } from "../../lib/platform/show-alert.ts";
import { deckListStore } from "../../store/deck-list-store.ts";
import { screenStore } from "../../store/screen-store.ts";
import { t } from "../../translations/t.ts";
import { notifySuccess } from "../shared/snackbar/snackbar.tsx";

const screenshots = {
  1: {
    src: "/img/anki-import/gear-icon.png",
    altKey: "anki_import_screenshot_gear_alt",
  },
  2: {
    src: "/img/anki-import/export-menu.png",
    altKey: "anki_import_screenshot_export_menu_alt",
  },
  3: {
    src: "/img/anki-import/export-dialog.png",
    altKey: "anki_import_screenshot_export_dialog_alt",
  },
} as const;

type ScreenshotStep = keyof typeof screenshots;

export class AnkiImportScreenStore {
  openStep: ScreenshotStep | null = null;
  importDeckMutation = makeMutation((file: File) => {
    const formData = new FormData();
    formData.set("file", file);

    return api.anki.import.mutate(formData);
  });

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  openScreenshot(step: ScreenshotStep) {
    this.openStep = step;
  }

  closeScreenshot() {
    this.openStep = null;
  }

  get openScreenshotInfo() {
    if (this.openStep === null) {
      return null;
    }

    const screenshot = screenshots[this.openStep];

    return {
      src: screenshot.src,
      alt: t(screenshot.altKey),
    };
  }

  get isMainButtonVisible() {
    return this.openStep === null;
  }

  async uploadFile(file: File | null | undefined) {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".apkg")) {
      showAlert(t("anki_import_invalid_file"));
      return;
    }

    let result: Awaited<ReturnType<typeof api.anki.import.mutate>>;
    try {
      result = await this.importDeckMutation.mutate(file);
    } catch (error) {
      showAlert(
        error instanceof Error ? error.message : t("anki_import_error"),
      );
      return;
    }

    runInAction(() => {
      for (const deck of result.importedDecks) {
        deckListStore.replaceDeck(deck, true);
      }
      deckListStore.updateFolders(result.folders);
      deckListStore.updateCardsToReview(result.cardsToReview);
      screenStore.replace({ type: "deckPreview", deckId: result.deck.id });
    });

    notifySuccess(t("anki_import_success"));
  }
}
