import { motion, MotionProps } from "framer-motion";
import { css } from "@emotion/css";
import React from "react";
import { theme } from "../../ui/theme.tsx";
import { observer } from "mobx-react-lite";
import { CardUnderReviewStore } from "../../store/card-under-review-store.ts";
import { HorizontalDivider } from "../../ui/horizontal-divider.tsx";
import { CardSpeaker } from "./card-speaker.tsx";

export const cardSize = 310;

type FramerMotionProps = Pick<MotionProps, "style" | "animate" | "initial">;

type Props = {
  card: CardUnderReviewStore;
} & FramerMotionProps;

export const Card = observer(({ card, style, animate }: Props) => {
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
      })}
      animate={animate}
      style={{ ...style, background: theme.secondaryBgColorComputed }}
      transition={{ ease: [0.6, 0.05, -0.01, 0.9] }}
    >
      <span
        className={css({
          textAlign: "center",
          fontWeight: 600,
          color: theme.textColor,
        })}
      >
        <div>
          {card.front} <CardSpeaker card={card} type={"front"} />
        </div>
        {card.isOpened ? <HorizontalDivider /> : null}
        {card.isOpened ? (
          <div>
            {card.back} <CardSpeaker card={card} type={"back"} />
          </div>
        ) : null}
        {card.isOpened && card.example ? (
          <div
            className={css({ fontWeight: 400, fontSize: 14, paddingTop: 8 })}
          >
            {card.example}
          </div>
        ) : null}
      </span>
    </motion.div>
  );
});
