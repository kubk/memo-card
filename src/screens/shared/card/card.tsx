import { motion } from "framer-motion";
import { css } from "@emotion/css";
import React from "react";
import { theme } from "../../../ui/theme.tsx";
import { observer } from "mobx-react-lite";
import { CardUnderReviewStore } from "../../deck-review/store/card-under-review-store.ts";
import { HorizontalDivider } from "../../../ui/horizontal-divider.tsx";
import { CardSpeaker } from "./card-speaker.tsx";
import { CardFieldView } from "./card-field-view.tsx";

export const cardSize = 310;

export type LimitedCardUnderReviewStore = Pick<
  CardUnderReviewStore,
  | "isOpened"
  | "deckSpeakField"
  | "isSpeakingCardsEnabledSettings"
  | "speak"
  | "front"
  | "back"
  | "example"
>;

type Props = {
  card: LimitedCardUnderReviewStore;
};

export const Card = observer(({ card }: Props) => {
  return (
    <motion.div
      className={css({
        position: "absolute",
        left: "50%",
        top: 0,
        marginLeft: -(cardSize / 2),
        height: cardSize,
        width: cardSize,
        boxSizing: "border-box",
        borderRadius: theme.borderRadius,
        color: theme.textColor,
        display: "grid",
        placeItems: "center center",
        padding: 10,
        background: theme.secondaryBgColorComputed,
      })}
    >
      <span
        className={css({
          textAlign: "center",
          fontWeight: 600,
          color: theme.textColor,
        })}
      >
        <div>
          <CardFieldView text={card.front} />{" "}
          <CardSpeaker card={card} type={"front"} />
        </div>
        {card.isOpened ? <HorizontalDivider /> : null}
        {card.isOpened ? (
          <div>
            <CardFieldView text={card.back} />{" "}
            <CardSpeaker card={card} type={"back"} />
          </div>
        ) : null}
        {card.isOpened && card.example ? (
          <div
            className={css({ fontWeight: 400, fontSize: 14, paddingTop: 8 })}
          >
            <CardFieldView text={card.example} />
          </div>
        ) : null}
      </span>
    </motion.div>
  );
});
