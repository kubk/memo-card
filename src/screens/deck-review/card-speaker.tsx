import { isSpeechSynthesisSupported } from "../../lib/voice-playback/speak.ts";
import { throttle } from "../../lib/throttle/throttle.ts";
import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { observer } from "mobx-react-lite";
import { LimitedCardUnderReviewStore } from "./card.tsx";

type Props = {
  card: LimitedCardUnderReviewStore;
  type: "front" | "back";
};

export const CardSpeaker = observer((props: Props) => {
  const { card, type } = props;
  if (
    !isSpeechSynthesisSupported ||
    !card.isOpened ||
    type !== card.deckSpeakField ||
    !card.isSpeakingCardsEnabledSettings
  ) {
    return null;
  }

  // throttle is needed to avoid user clicking on the speaker many times in a row hence creating many sounds
  return (
    <i
      onClick={throttle(card.speak, 500)}
      className={cx(
        "mdi mdi-play-circle mdi-24px",
        css({
          cursor: "pointer",
          position: "relative",
          top: 3,
          color: theme.buttonColor,
        }),
      )}
    />
  );
});
