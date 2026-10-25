import { useState } from "preact/compat";
import { TRPCClientError } from "@trpc/client";
import { type ApiRouter } from "api";
import { AnkiImportScreenView } from "../src/screens/anki-import/anki-import-screen.tsx";
import { AnkiImportScreenStore } from "../src/screens/anki-import/anki-import-screen-store.ts";
import { BrowserMainButton } from "../src/screens/shared/browser-platform/browser-main-button.tsx";
import { Tabs, TabsList, TabsTrigger } from "../src/ui/shadcn/tabs.tsx";
import { PlaygroundButton } from "./ui/playground-button.tsx";
import { PropGroup } from "./ui/prop-controls.tsx";
import { PropsPanel } from "./ui/props-panel.tsx";

const packageSizeBytes = 95 * 1024 * 1024;
const wrongTypeFile = new File([], "deck.txt");
const tooLargeFile = new File([new Uint8Array(1024)], "too-large.apkg");
const tooManyCardsFile = new File(
  [new Uint8Array(1024)],
  "too-many-cards.apkg",
);
const failingFile = new File([new Uint8Array(1024)], "failing.apkg");

const createUserFacingError = (userMessage: string) => {
  return new TRPCClientError<ApiRouter>(userMessage, {
    result: {
      error: {
        code: -32013,
        message: userMessage,
        data: { code: "PAYLOAD_TOO_LARGE", httpStatus: 413, userMessage },
      },
    },
  });
};

const uploadPackage = async (file: File) => {
  if (file === tooLargeFile) {
    throw createUserFacingError(
      "File is too large, the maximum size is 100 MB",
    );
  }

  return file.name;
};

const importPackage = async ({ uploadId }: { uploadId: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  throw uploadId === tooManyCardsFile.name
    ? createUserFacingError(
        "The deck has too many cards, the maximum is 10,000",
      )
    : new Error("Import failed");
};

export function AnkiImportPlayground() {
  const [store] = useState(
    () => new AnkiImportScreenStore(uploadPackage, importPackage),
  );

  return (
    <>
      <div className="h-full w-full overflow-y-auto bg-secondary-bg text-text">
        <AnkiImportScreenView store={store} />
      </div>
      <BrowserMainButton />
      <PropsPanel>
        <PropGroup label="State">
          <Tabs
            value={
              store.isUploaded
                ? "uploaded"
                : store.importProgress
                  ? "uploading"
                  : "steps"
            }
            onValueChange={(value) => {
              if (value === "steps") {
                store.finishImport();
              }
              if (value === "uploading") {
                store.setUploadProgress(
                  packageSizeBytes * 0.45,
                  packageSizeBytes,
                );
              }
              if (value === "uploaded") {
                store.setUploadProgress(packageSizeBytes, packageSizeBytes);
              }
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="steps">
                Steps
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="uploading">
                Uploading
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="uploaded">
                Uploaded
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </PropGroup>
        <PropGroup label="Errors">
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: "Wrong file type", file: wrongTypeFile },
              { label: "File too large", file: tooLargeFile },
              { label: "Too many cards", file: tooManyCardsFile },
              { label: "Other error", file: failingFile },
            ].map(({ label, file }) => (
              <PlaygroundButton
                type="button"
                size="sm"
                variant="outline"
                key={label}
                onClick={() => store.uploadFile(file)}
              >
                {label}
              </PlaygroundButton>
            ))}
          </div>
        </PropGroup>
      </PropsPanel>
    </>
  );
}
