import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useState } from "react";
import { CardInputModeStore } from "./store/card-input-mode-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { RadioList } from "../../ui/radio-list/radio-list.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { t } from "../../translations/t.ts";
import { DeckFormStore } from "../deck-form/deck-form/store/deck-form-store.ts";

type Props = { deckFormStore: DeckFormStore };

export const CardInputModeScreen = observer((props: Props) => {
  const { deckFormStore } = props;
  const [store] = useState(() => new CardInputModeStore(deckFormStore));

  useBackButton(() => {
    deckFormStore.quitInnerScreen();
  });

  useMount(() => {
    store.load();
  });

  useMainButton(t("save"), () => {
    store.submit();
  });

  useProgress(() => {
    return store.cardInputModesRequest.isLoading;
  });

  return (
    <Screen title={t("card_input_mode_screen")}>
      {store.cardInputModesRequest.result.status === "loading" ? (
        <FullScreenLoader />
      ) : null}
      {store.cardInputModesRequest.result.status === "success" ? (
        <div>
          <RadioList
            selectedId={store.modeId?.value}
            options={[
              { id: null, title: "Manual input" } as {
                id: string | null;
                title: string;
              },
            ].concat(
              store.cardInputModesRequest.result.data.map((inputMode) => ({
                id: inputMode.id,
                title: inputMode.title,
              })),
            )}
            onChange={store.modeId.onChange}
          />
        </div>
      ) : null}
    </Screen>
  );
});
