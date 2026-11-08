import { useRef, useState } from "preact/compat";
import { FileIcon } from "lucide-react";
import { ActivityIndicator } from "../../ui/activity-indicator.tsx";
import { ButtonLink } from "../../ui/button-link.tsx";
import { cn } from "../../ui/cn.ts";
import { ProgressBar } from "../../ui/progress-bar.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useOverlay } from "../../lib/react/use-overlay.ts";
import { screenStore } from "../../store/screen-store.ts";
import { t } from "../../translations/t.ts";
import { td } from "../../translations/td.tsx";
import { Screen } from "../shared/screen.tsx";
import { AnkiImportScreenStore } from "./anki-import-screen-store.ts";

const steps = [
  {
    number: 1,
    titleKey: "anki_import_step_1_title",
    textKey: "anki_import_step_1",
    screenshotStep: 1,
  },
  {
    number: 2,
    titleKey: "anki_import_step_2_title",
    textKey: "anki_import_step_2",
    screenshotStep: 2,
  },
  {
    number: 3,
    titleKey: "anki_import_step_3_title",
    textKey: "anki_import_step_3",
    screenshotStep: 3,
  },
] as const;

export function AnkiImportScreen() {
  const [store] = useState(() => new AnkiImportScreenStore());

  return <AnkiImportScreenView store={store} />;
}

export function AnkiImportScreenView({
  store,
}: {
  store: AnkiImportScreenStore;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useBackButton(() => {
    screenStore.back();
  });

  useMainButton(
    t("anki_import_main_button"),
    () => {
      fileInputRef.current?.click();
    },
    () => store.isMainButtonVisible,
    [store],
  );

  return (
    <Screen>
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept=".apkg"
        onChange={async (event) => {
          const input = event.currentTarget;
          const file = input.files?.[0];
          try {
            await store.uploadFile(file);
          } finally {
            input.value = "";
          }
        }}
      />

      <div className="mx-auto flex min-h-[calc(var(--app-viewport-height)_-_9.375rem)] w-full max-w-75 flex-col items-center justify-center pb-28 pt-8">
        <AnkiImportIllustration />

        <h2 className="mt-5 text-center text-[1.75rem] font-bold leading-tight">
          {t("anki_import_heading")}
        </h2>

        {store.importProgress ? (
          <div className="mt-8 flex w-full flex-col items-center gap-8">
            <ProgressBar
              value={store.importProgress.uploadedBytes}
              max={store.importProgress.totalBytes}
              label={`${store.uploadPercent}%`}
              color="button"
            />
            <ActivityIndicator
              className={cn(!store.isUploaded && "invisible")}
            />
          </div>
        ) : (
          <AnkiImportSteps store={store} />
        )}
      </div>

      <AnkiImportScreenshotLightbox store={store} />
    </Screen>
  );
}

function AnkiImportSteps({ store }: { store: AnkiImportScreenStore }) {
  return (
    <div className="mt-8 flex w-full flex-col gap-8">
      {steps.map((step) => (
        <div
          className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-5"
          key={step.number}
        >
          <div className="flex h-18 w-18 items-center justify-center rounded-[1.25rem] bg-button-outline-bg-light text-[2.125rem] font-bold leading-none text-link dark:bg-button-outline-bg-dark dark:text-button-outline-fg-dark">
            {step.number}
          </div>
          <div>
            <div className="text-[1.0625rem] font-bold leading-6">
              {t(step.titleKey)}
            </div>
            <div className="mt-1 text-[1.0625rem] leading-6 text-hint">
              {td(step.textKey, {
                link: (text) => (
                  <ButtonLink
                    variant="dotted"
                    onClick={() => store.openScreenshot(step.screenshotStep)}
                  >
                    {text}
                  </ButtonLink>
                ),
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnkiImportScreenshotLightbox(props: { store: AnkiImportScreenStore }) {
  const { store } = props;
  const openScreenshot = store.openScreenshotInfo;

  useOverlay(openScreenshot !== null);

  if (!openScreenshot) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 safe-viewport-padding"
      onClick={store.closeScreenshot}
    >
      <img
        className="block max-h-[calc(var(--app-viewport-height)_-_var(--app-safe-area-top)_-_var(--app-bottom-inset)_-_5rem)] max-w-[calc(100vw_-_2rem)] object-contain"
        src={openScreenshot.src}
        alt={openScreenshot.alt}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

function AnkiImportIllustration() {
  return (
    <div className="relative flex h-47.5 w-57.5 items-center justify-center">
      <div className="h-36.5 w-36.5 rounded-full bg-button-outline-bg-light dark:bg-button-outline-bg-dark" />

      <div className="absolute top-7.75 flex h-32 w-28 flex-col items-center overflow-visible">
        <FileIcon
          className="absolute inset-0 h-full w-full text-button-outline-bg-light dark:text-button-outline-bg-dark"
          fill="var(--tg-theme-bg-color)"
          strokeWidth={1}
        />

        <div className="h-13" />
        <div className="relative w-28 rounded-md bg-button py-1.5 text-center text-lg font-bold leading-none text-button-text shadow-xs">
          .apkg
        </div>
      </div>
    </div>
  );
}
