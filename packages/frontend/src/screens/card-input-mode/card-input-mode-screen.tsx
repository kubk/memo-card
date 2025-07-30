import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { ReactNode, useState } from "react";
import { CardInputModeStore } from "./store/card-input-mode-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { RadioList } from "../../ui/radio-list/radio-list.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { DeckFormStore } from "../deck-form/deck-form/store/deck-form-store.ts";
import { IndividualCardAiPreview } from "../shared/feature-preview/individual-card-ai-preview.tsx";
import { CircleHelpIcon, EditIcon, PlusIcon } from "lucide-react";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";

type Props = { deckFormStore: DeckFormStore };

export function CardInputModeScreen(props: Props) {
  const { deckFormStore } = props;
  const [store] = useState(() => new CardInputModeStore(deckFormStore));

  useMount(() => {
    store.load();
  });

  useBackButton(() => {
    deckFormStore.quitInnerScreen();
  });

  useMainButton(
    t("save"),
    () => store.submit(),
    () => !store.isBottomSheetScreen,
  );

  useProgress(() => store.cardInputModesRequest.isLoading);

  return (
    <Screen title={t("card_input_mode_screen")}>
      {store.cardInputModesRequest.result.status === "loading" ? (
        <FullScreenLoader />
      ) : null}
      {store.cardInputModesRequest.result.status === "success" ? (
        <>
          <RadioList
            selectedId={store.modeId?.value}
            options={[
              { id: null, title: t("card_input_mode_manual") } as {
                id: string | null;
                title: ReactNode;
              },
            ].concat(
              store.cardInputModesRequest.result.data.map((inputMode) => ({
                id: inputMode.id,
                title: (
                  <div className="w-full relative">
                    <div>{inputMode.title}</div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-0 flex gap-2">
                      {inputMode.authorId ? (
                        <div
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            deckFormStore.goCardInputModeForm(inputMode.id);
                          }}
                        >
                          <EditIcon size={24} />
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            store.viewModeId.onChange(inputMode.id);
                          }}
                        >
                          <CircleHelpIcon size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                ),
              })),
            )}
            onChange={store.modeId.onChange}
          />
          <div className="mb-6">
            <ButtonGrid>
              <ButtonSideAligned
                outline
                onClick={() => deckFormStore.goCardInputModeForm()}
                icon={<PlusIcon size={24} />}
              >
                {t("card_input_mode_add_button")}
              </ButtonSideAligned>
            </ButtonGrid>
          </div>
        </>
      ) : null}

      <IndividualCardAiPreview
        isOpen={!!store.viewModeId.value}
        onClose={() => {
          store.viewModeId.onChange(null);
        }}
        viewMode={store.viewMode}
      />
    </Screen>
  );
}
