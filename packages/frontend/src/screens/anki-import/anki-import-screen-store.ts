import { makeAutoObservable, runInAction } from "mobx";
import { uploadWithProgress } from "../../api/file-upload.ts";
import { getUserErrorMessage } from "../../api/get-user-error-message.ts";
import { api } from "../../api/trpc-api.ts";
import { showAlert } from "../../lib/platform/show-alert.ts";
import { reportHandledError } from "../../lib/rollbar/rollbar.tsx";
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

type ImportProgress = { uploadedBytes: number; totalBytes: number };

const uploadAnkiPackage = async (
  file: File,
  onProgress: (uploadedBytes: number, totalBytes: number) => void,
) => {
  const { uploadId, url } = await api.anki.uploadUrl.mutate({
    size: file.size,
  });
  await uploadWithProgress(url, file, onProgress);

  return uploadId;
};

export class AnkiImportScreenStore {
  openStep: ScreenshotStep | null = null;
  importProgress: ImportProgress | null = null;

  constructor(
    private uploadPackage = uploadAnkiPackage,
    private importPackage = api.anki.import.mutate,
  ) {
    makeAutoObservable<this, "uploadPackage" | "importPackage">(
      this,
      { uploadPackage: false, importPackage: false },
      { autoBind: true },
    );
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
    return this.openStep === null && this.importProgress === null;
  }

  get uploadPercent() {
    if (!this.importProgress) {
      return 0;
    }

    const { uploadedBytes, totalBytes } = this.importProgress;
    return Math.round((uploadedBytes / totalBytes) * 100);
  }

  get isUploaded() {
    return (
      this.importProgress !== null &&
      this.importProgress.uploadedBytes >= this.importProgress.totalBytes
    );
  }

  setUploadProgress(uploadedBytes: number, totalBytes: number) {
    this.importProgress = { uploadedBytes, totalBytes };
  }

  finishImport() {
    this.importProgress = null;
  }

  async uploadFile(file: File | null | undefined) {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".apkg")) {
      showAlert(t("anki_import_invalid_file"));
      return;
    }

    this.setUploadProgress(0, file.size);
    let result: Awaited<ReturnType<typeof api.anki.import.mutate>>;
    try {
      const uploadId = await this.uploadPackage(file, this.setUploadProgress);
      this.setUploadProgress(file.size, file.size);
      result = await this.importPackage({ uploadId });
    } catch (error) {
      const userMessage = getUserErrorMessage(error);
      if (!userMessage) {
        reportHandledError("Anki import failed", error);
      }
      showAlert(userMessage ?? t("error_contact_support"));
      return;
    } finally {
      this.finishImport();
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
