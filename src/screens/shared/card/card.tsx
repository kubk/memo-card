import { css } from "@emotion/css";
import React from "react";
import { theme } from "../../../ui/theme.tsx";
import { observer } from "mobx-react-lite";
import { CardUnderReviewStore } from "../../deck-review/store/card-under-review-store.ts";
import { HorizontalDivider } from "../../../ui/horizontal-divider.tsx";
import { CardSpeaker } from "./card-speaker.tsx";
import { CardFieldView } from "./card-field-view.tsx";
import { assert } from "../../../lib/typescript/assert.ts";
import { useIsOverflowing } from "../../../lib/react/use-is-overflowing.ts";
import { Dropdown } from "../../../ui/dropdown.tsx";
import { t } from "../../../translations/t.ts";
import { boolNarrow } from "../../../lib/typescript/bool-narrow.ts";
import { userStore } from "../../../store/user-store.ts";
import { hapticSelection } from "../../../lib/telegram/haptics.ts";

export const cardSize = 310;
export const IDK_ID = "idk";

export type LimitedCardUnderReviewStore = Pick<
  CardUnderReviewStore,
  | "isOpened"
  | "deckSpeakField"
  | "speak"
  | "front"
  | "back"
  | "example"
  | "answerType"
  | "answers"
  | "answer"
  | "openWithAnswer"
  | "open"
  | "isOverflowing"
  | "isCardSpeakerVisible"
  | "canSpeak"
>;

type Props = {
  card: LimitedCardUnderReviewStore;
  onHideCardForever?: () => void;
};

export const Card = observer((props: Props) => {
  const { card, onHideCardForever } = props;
  const { ref: cardRef } = useIsOverflowing(
    card.isOpened,
    (is) => card?.isOverflowing.setValue(is),
  );

  return (
    <div
      ref={cardRef}
      className={
        card.answerType === "remember"
          ? css({
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
              background: theme.bgColor,
              overflowX: "auto",
            })
          : css({
              color: theme.textColor,
            })
      }
    >
      {
        <div
          className={css({
            position: "absolute",
            top: 0,
            right: 30,
            cursor: "pointer",
          })}
        >
          <Dropdown
            items={[
              onHideCardForever
                ? {
                    text: t("hide_card_forever"),
                    onClick: () => {
                      onHideCardForever();
                    },
                  }
                : undefined,
              card.canSpeak
                ? {
                    text: userStore.isSpeakingCardsMuted.value
                      ? t("unmute_cards")
                      : t("mute_cards"),
                    onClick: () => {
                      userStore.isSpeakingCardsMuted.toggle();
                      hapticSelection();
                    },
                  }
                : undefined,
            ].filter(boolNarrow)}
          />
        </div>
      }
      <span
        className={css({
          textAlign: "center",
          fontWeight: 600,
          color: theme.textColor,
        })}
      >
        <div className={css({ wordBreak: "break-word" })}>
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
        {card.isOpened && card.answerType === "choice_single" ? (
          <>
            {!!card.back && <HorizontalDivider />}
            {(() => {
              assert(card.answer);
              if (card.answer.isCorrect) {
                return (
                  <div className={css({ fontWeight: "normal" })}>
                    <span className={css({ color: theme.success })}>
                      {t("review_correct_label")}:{" "}
                    </span>
                    {card.answer.text}
                  </div>
                );
              }
              if (!card.answer.isCorrect) {
                const correctAnswer = card.answers.find(
                  (answer) => answer.isCorrect,
                );

                return (
                  <div className={css({ fontWeight: "normal" })}>
                    <div>
                      {card.answer.id !== IDK_ID && (
                        <span className={css({ color: theme.danger })}>
                          {t("review_wrong_label")}:{" "}
                        </span>
                      )}
                      {card.answer.text}
                    </div>
                    <div>
                      {t("review_correct_label")}: {correctAnswer?.text}
                    </div>
                  </div>
                );
              }
            })()}
          </>
        ) : null}
      </span>
    </div>
  );
});
