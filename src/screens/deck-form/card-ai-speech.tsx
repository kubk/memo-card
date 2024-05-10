import { observer } from "mobx-react-lite";
import { CardFormType } from "./store/deck-form-store.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { Screen } from "../shared/screen.tsx";
import { AudioPlayer } from "../../ui/audio-player.tsx";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { t } from "../../translations/t.ts";
import { Button } from "../../ui/button.tsx";
import { ButtonGrid } from "../../ui/button-grid.tsx";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { Flex } from "../../ui/flex.tsx";
import { Chip } from "../../ui/chip.tsx";
import { Input } from "../../ui/input.tsx";
import { useState } from "react";
import { AiSpeechGeneratorStore } from "./store/ai-speech-generator-store.ts";

type Props = {
  cardForm: CardFormType;
  onBack: () => void;
};

export const CardAiSpeech = observer((props: Props) => {
  const { cardForm, onBack } = props;

  const [store] = useState(() => new AiSpeechGeneratorStore(cardForm));
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
              icon={"mdi-delete"}
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
          <div
            className={css({
              alignSelf: "center",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              color: theme.hintColor,
              width: "100%",
              fontSize: 14,
            })}
          >
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
            disabled={store.isLoading}
            icon={store.isLoading ? "mdi-loading mdi-spin" : undefined}
            outline
            onClick={() => {
              store.generate();
            }}
          >
            {store.isLoading ? undefined : t("ai_speech_generate")}
          </Button>
        </>
      )}
    </Screen>
  );
});
