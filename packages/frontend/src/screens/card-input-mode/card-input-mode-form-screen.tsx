import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { useState } from "react";
import { CardInputModeFormStore } from "./store/card-input-mode-form-store.ts";
import { useMount } from "../../lib/react/use-mount.ts";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { useProgress } from "../../lib/platform/use-progress.tsx";
import { DeckFormStore } from "../deck-form/deck-form/store/deck-form-store.ts";
import { Input } from "../../ui/input.tsx";
import { TrashIcon } from "lucide-react";
import { Label } from "../../ui/label.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { ButtonSideAligned } from "../../ui/button-side-aligned.tsx";
import { t } from "../../translations/t.ts";

export function CardInputModeFormScreen({
  deckFormStore,
}: {
  deckFormStore: DeckFormStore;
}) {
  const [store] = useState(() => new CardInputModeFormStore(deckFormStore));
  useMount(() => {
    store.load();
  });

  useBackButton(() => {
    deckFormStore.quitInnerScreen();
  });

  useMainButton(
    t("save"),
    () => store.submit(),
    () => !store.isAnyRequestLoading,
  );

  useProgress(() => store.isAnyRequestLoading);

  if (store.cardInputModesRequest.result.status === "loading") {
    return <FullScreenLoader />;
  }

  return (
    <Screen
      title={
        store.isEditing
          ? t("card_input_mode_form_edit_title")
          : t("card_input_mode_form_create_title")
      }
    >
      <div className="space-y-4">
        <Label text={t("card_input_mode_form_title")}>
          <Input
            field={store.form.title}
            placeholder={t("card_input_mode_form_title_placeholder")}
          />
        </Label>

        <Label text={t("card_input_mode_form_ai_prompt")}>
          <Input
            field={store.form.prompt}
            placeholder={t("card_input_mode_form_prompt_placeholder")}
            type="textarea"
            rows={3}
          />
        </Label>

        <Label text={t("card_front_title")}>
          <Input
            field={store.form.front}
            placeholder={t("card_input_mode_form_front_placeholder")}
          />
        </Label>

        <Label text={t("card_back_title")}>
          <Input
            field={store.form.back}
            placeholder={t("card_input_mode_form_back_placeholder")}
          />
        </Label>

        <Label text={t("card_field_example_title")}>
          <Input
            field={store.form.example}
            placeholder={t("card_input_mode_form_example_placeholder")}
            type="textarea"
            rows={2}
          />
        </Label>

        {store.isEditing && (
          <ButtonGrid>
            <ButtonSideAligned
              outline
              onClick={store.handleDelete}
              disabled={store.isAnyRequestLoading}
              icon={<TrashIcon size={24} />}
            >
              {t("delete")}
            </ButtonSideAligned>
          </ButtonGrid>
        )}
      </div>
    </Screen>
  );
}
