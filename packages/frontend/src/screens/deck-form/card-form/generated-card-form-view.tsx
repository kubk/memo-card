import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { useState } from "react";
import { AiGeneratedCardFormStore } from "./store/ai-generated-card-form-store.ts";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { t } from "../../../translations/t.ts";
import { useProgress } from "../../../lib/platform/use-progress.tsx";
import { useMount } from "../../../lib/react/use-mount.ts";
import { Screen } from "../../shared/screen.tsx";
import { Label } from "../../../ui/label.tsx";
import { Input } from "../../../ui/input.tsx";
import { CardRowLoading } from "../../shared/card-row-loading.tsx";
import { CardRow } from "../../../ui/card-row.tsx";
import { assert } from "api";
import { screenStore } from "../../../store/screen-store.ts";
import { useCardFormStore } from "./store/card-form-store-context.tsx";

export function GeneratedCardFormView() {
  const cardFormStore = useCardFormStore();
  const cardInputModeId = cardFormStore.cardInputModeId;
  assert(cardInputModeId, "Card input mode should not be empty before editing");

  useBackButton(() => {
    const screen = screenStore.screen;
    // Avoid duplicated 'deckForm' in the router history
    if (screen.type === "deckForm" && screen.cardId) {
      screenStore.back();
    }

    cardFormStore.onBackCard();
  });

  const [formStore] = useState(() => new AiGeneratedCardFormStore());

  useMainButton(t("generate"), () => {
    formStore.submit();
  });

  useProgress(() => formStore.isSaveLoading);

  useMount(() => {
    formStore.cardInputModesRequest.execute();
  });

  return (
    <Screen title={t("add_card")}>
      <Label text={t("card_front_side_hint")} isPlain>
        <Input field={formStore.form.prompt} type={"textarea"} rows={2} />
      </Label>

      <Label text={t("card_input_mode_screen")} isPlain>
        {formStore.cardInputModesRequest.result.status === "loading" ? (
          <CardRowLoading speed={1} />
        ) : null}
        {formStore.cardInputModesRequest.result.status === "success"
          ? (() => {
              const inputMode =
                formStore.cardInputModesRequest.result.data.find(
                  (inputMode) => inputMode.id === cardInputModeId,
                );
              assert(inputMode, "Input mode should be found");

              return (
                <CardRow>
                  <span>{inputMode.title}</span>
                </CardRow>
              );
            })()
          : null}
      </Label>
    </Screen>
  );
}
