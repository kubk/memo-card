import { CardFormType } from "../deck-form/store/deck-form-store.ts";
import { useBackButton } from "../../../lib/platform/use-back-button.ts";
import { Screen } from "../../shared/screen.tsx";
import { AudioPlayer } from "../../../ui/audio-player.tsx";
import { useMainButton } from "../../../lib/platform/use-main-button.ts";
import { t } from "../../../translations/t.ts";
import { Button } from "../../../ui/button.tsx";
import { ButtonGrid } from "../../../ui/button-grid.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { Chip } from "../../../ui/chip.tsx";
import { Input } from "../../../ui/input.tsx";
import { useState } from "react";
import { AiSpeechGeneratorStore } from "./store/ai-speech-generator-store.ts";
import { LoaderCircle, TrashIcon } from "lucide-react";
import { LimitedDeckForm } from "../deck-form/store/card-form-store-interface.ts";

type Props = {
  cardForm: CardFormType;
  deckForm: LimitedDeckForm;
  onBack: () => void;
};

export function CardAiSpeech(props: Props) {
  const { cardForm, deckForm, onBack } = props;

  const [store] = useState(
    () => new AiSpeechGeneratorStore(cardForm, deckForm),
  );
  const { form } = store;

  useBackButton(() => {
    onBack();
  });

  useMainButton(t("go_back"), () => {
    onBack();
  });

  return (
    <Screen title={t("ai_speech_title")}>
      {cardForm.options.value?.voice ? (
        <>
          <AudioPlayer src={cardForm.options.value.voice} />
          <ButtonGrid>
            <Button
              icon={<TrashIcon size={24} />}
              outline
              onClick={() => {
                store.onDeleteAiVoice();
              }}
            >
              {t("delete")}
            </Button>
          </ButtonGrid>
        </>
      ) : (
        <>
          <div className="self-center text-center flex flex-col gap-1 text-hint w-full text-sm">
            <span>{t("ai_speech_empty")}</span>
            <Flex gap={8}>
              {(["front", "back"] as const).map((side) => {
                return (
                  <Chip
                    key={side}
                    fullWidth
                    isSelected={side === form.sourceSide.value}
                    onClick={() => {
                      form.sourceSide.onChange(side);
                    }}
                  >
                    {t(side)}
                  </Chip>
                );
              })}
            </Flex>
            <span>{t("ai_speech_type")}</span>
            <Input field={form.sourceText} />
          </div>

          <Button
            disabled={store.speechGenerateRequest.isLoading}
            icon={
              store.speechGenerateRequest.isLoading ? (
                <LoaderCircle size={18} className="text-button" />
              ) : undefined
            }
            outline
            onClick={() => {
              store.generate();
            }}
          >
            {store.speechGenerateRequest.isLoading
              ? undefined
              : t("ai_speech_generate")}
          </Button>
        </>
      )}
    </Screen>
  );
}
