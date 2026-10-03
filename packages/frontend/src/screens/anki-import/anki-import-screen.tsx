import { useRef, useState } from "react";
import { FileIcon } from "lucide-react";
import { ButtonLink } from "../../ui/button-link.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
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
  useProgress(() => store.importDeckMutation.isPending);

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

      <div className="mx-auto flex min-h-[calc(100vh_-_150px)] w-full max-w-[300px] flex-col items-center justify-center pb-28 pt-8">
        <AnkiImportIllustration />

        <h2 className="mt-5 text-center text-[28px] font-bold leading-tight">
          {t("anki_import_heading")}
        </h2>

        <div className="mt-8 flex w-full flex-col gap-8">
          {steps.map((step) => (
            <div
              className="grid grid-cols-[72px_minmax(0,1fr)] items-start gap-5"
              key={step.number}
            >
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-button-outline-bg-light text-[34px] font-bold leading-none text-link dark:bg-button-outline-bg-dark dark:text-button-outline-fg-dark">
                {step.number}
              </div>
              <div>
                <div className="text-[17px] font-bold leading-6">
                  {t(step.titleKey)}
                </div>
                <div className="mt-1 text-[17px] leading-6 text-hint">
                  {td(step.textKey, {
                    link: (text) => (
                      <ButtonLink
                        variant="dotted"
                        onClick={() =>
                          store.openScreenshot(step.screenshotStep)
                        }
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
      </div>

      <AnkiImportScreenshotLightbox store={store} />
    </Screen>
  );
}

function AnkiImportScreenshotLightbox(props: { store: AnkiImportScreenStore }) {
  const { store } = props;
  const openScreenshot = store.openScreenshotInfo;

  if (!openScreenshot) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={store.closeScreenshot}
    >
      <img
        className="block max-h-[calc(100vh_-_80px)] max-w-[calc(100vw_-_32px)] object-contain"
        src={openScreenshot.src}
        alt={openScreenshot.alt}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

function AnkiImportIllustration() {
  return (
    <div className="relative flex h-[190px] w-[230px] items-center justify-center">
      <div className="h-[146px] w-[146px] rounded-full bg-button-outline-bg-light dark:bg-button-outline-bg-dark" />

      <div className="absolute top-[31px] flex h-[128px] w-[112px] flex-col items-center overflow-visible">
        <FileIcon
          className="absolute inset-0 h-full w-full text-button-outline-bg-light dark:text-button-outline-bg-dark"
          fill="var(--tg-theme-bg-color)"
          strokeWidth={1}
        />

        <div className="h-[52px]" />
        <div className="relative w-[112px] rounded-md bg-button py-1.5 text-center text-lg font-bold leading-none text-button-text shadow-xs">
          .apkg
        </div>
      </div>
    </div>
  );
}
