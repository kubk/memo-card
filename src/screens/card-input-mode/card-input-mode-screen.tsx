import { observer } from "mobx-react-lite";
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
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { BottomSheet } from "../../ui/bottom-sheet/bottom-sheet.tsx";
import { Flex } from "../../ui/flex.tsx";
import { CardSidePreview } from "./card-side-preview.tsx";
import { BottomSheetTitle } from "../../ui/bottom-sheet/bottom-sheet-title.tsx";

type Props = { deckFormStore: DeckFormStore };

export const CardInputModeScreen = observer((props: Props) => {
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
                <div className={css({ width: "100%", position: "relative" })}>
                  <div>{inputMode.title}</div>
                  <div
                    className={css({
                      position: "absolute",
                      top: -6,
                      right: 0,
                    })}
                    onClick={(e) => {
                      e.stopPropagation();
                      store.viewModeId.onChange(inputMode.id);
                    }}
                  >
                    <i className={"mdi mdi-24px mdi-information-outline"} />
                  </div>
                </div>
              ),
            })),
          )}
          onChange={store.modeId.onChange}
        />
      ) : null}

      <BottomSheet
        isOpen={!!store.viewModeId.value}
        onClose={() => {
          store.viewModeId.onChange(null);
        }}
      >
        {(() => {
          const viewMode = store.viewMode;
          if (!viewMode) {
            return null;
          }

          return (
            <Flex direction={"column"} alignItems={"center"} pb={24}>
              <BottomSheetTitle
                title={viewMode.title}
                onClose={() => {
                  store.viewModeId.onChange(null);
                }}
              />
              <div className={css({ width: 250 })}>
                <Flex pb={16} justifyContent={"center"}>
                  {t("card_input_mode_type")}
                </Flex>
                <div
                  className={css({
                    padding: "12px 10px",
                    borderRadius: theme.borderRadius,
                    boxSizing: "border-box",
                    width: "100%",
                    backgroundColor: theme.secondaryBgColor,
                  })}
                >
                  {viewMode.preview_front}
                </div>

                <Flex pt={16} pb={16} justifyContent={"center"}>
                  {t("card_input_mode_get")}
                </Flex>

                <Flex gap={8} direction={"column"}>
                  <CardSidePreview
                    front={viewMode.preview_front}
                    back={viewMode.preview_back}
                    example={viewMode.preview_example}
                  />
                </Flex>
              </div>
            </Flex>
          );
        })()}
      </BottomSheet>
    </Screen>
  );
});
