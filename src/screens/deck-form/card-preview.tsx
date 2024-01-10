import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { Card } from "../shared/card/card.tsx";
import { css } from "@emotion/css";
import { t } from "../../translations/t.ts";
import { CardFormType } from "./store/deck-form-store.ts";

type Props = {
  form: CardFormType;
  onBack: () => void;
};

export const CardPreview = observer((props: Props) => {
  const { form, onBack } = props;

  useBackButton(() => {
    onBack();
  });

  return (
    <Screen title={t("card_preview")}>
      <div className={css({ position: "relative", marginTop: 40 })}>
        <Card
          card={{
            isOpened: true,
            back: form.back.value,
            front: form.front.value,
            example: form.example.value,
            speak: () => {},
            deckSpeakField: "front",
            isSpeakingCardsEnabledSettings: false,
          }}
          animate={{}}
          style={{}}
        />
      </div>
    </Screen>
  );
});
