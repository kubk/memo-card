import { CardUnderReviewStore } from "../../deck-review/store/card-under-review-store.ts";
import { HorizontalDivider } from "../../../ui/horizontal-divider.tsx";
import { CardSpeaker } from "./card-speaker.tsx";
import { CardFieldView } from "./card-field-view.tsx";
import { useIsOverflowing } from "../../../lib/react/use-is-overflowing.ts";
import { Dropdown } from "../../../ui/dropdown.tsx";
import { t } from "../../../translations/t.ts";
import { boolNarrow } from "../../../lib/typescript/bool-narrow.ts";
import { userStore } from "../../../store/user-store.ts";
import { hapticSelection } from "../../../lib/platform/telegram/haptics.ts";
import { assert } from "api";
import { cn } from "../../../ui/cn.ts";

// Export the constant for backward compatibility
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
  | "voicePlayer"
>;

type Props = {
  card: LimitedCardUnderReviewStore;
  onHideCardForever?: () => void;
};

export function Card(props: Props) {
  const { card, onHideCardForever } = props;
  const { ref: cardRef } = useIsOverflowing(
    card.isOpened,
    (is) => card?.isOverflowing.setValue(is),
  );

  return (
    <div
      ref={cardRef}
      className={cn(
        card.answerType === "remember"
          ? "absolute left-1/2 top-0 -ml-card-half h-card w-card box-border rounded-xl text-text flex items-center justify-center p-2.5 bg-bg overflow-x-auto"
          : "text-text",
      )}
    >
      {
        <div
          className={cn(
            "absolute -top-1",
            userStore.isRtl ? "left-[30px]" : "right-[30px]",
            "cursor-pointer",
          )}
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
              card.voicePlayer
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
      <span className="text-center font-semibold text-text">
        <div className="break-words">
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
          <div className="font-normal text-sm pt-2">
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
                  <div className="font-normal">
                    <span className="text-success">
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
                  <div className="font-normal">
                    <div>
                      {card.answer.id !== IDK_ID && (
                        <span className="text-danger">
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
}
