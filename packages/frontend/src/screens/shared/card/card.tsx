import { CardUnderReviewStore } from "../../deck-review/store/card-under-review-store.ts";
import { HorizontalDivider } from "../../../ui/horizontal-divider.tsx";
import { CardSpeaker } from "./card-speaker.tsx";
import { CardFieldView } from "./card-field-view.tsx";
import { t } from "../../../translations/t.ts";
import { assert } from "api";
import { cn } from "../../../ui/cn.ts";

export const cardSize = 310;
export const IDK_ID = "idk";

export type LimitedCardUnderReviewStore = Pick<
  CardUnderReviewStore,
  | "id"
  | "cardReviewType"
  | "interval"
  | "easeFactor"
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
  | "isAgain"
  | "isCardSpeakerVisible"
  | "voicePlayer"
>;

type Props = {
  card: LimitedCardUnderReviewStore;
};

export function Card(props: Props) {
  const { card } = props;

  return (
    <div
      className={cn(
        card.answerType === "remember"
          ? "min-h-[calc(100vh-16rem)] w-full box-border rounded-xl text-text flex items-center justify-center p-2.5 bg-bg overflow-x-auto"
          : "text-text",
      )}
    >
      <span className="text-center font-semibold text-text">
        <div className="break-words flex gap-2 justify-center items-center">
          <div className="mt-1">
            <CardFieldView text={card.front} />
          </div>
          <CardSpeaker card={card} type={"front"} />
        </div>
        {card.isOpened ? <HorizontalDivider /> : null}
        {card.isOpened ? (
          <div className="flex gap-2 justify-center items-center">
            <div className="mt-1">
              <CardFieldView text={card.back} />
            </div>
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
