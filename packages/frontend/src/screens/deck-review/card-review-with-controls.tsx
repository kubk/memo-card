import {
  Card,
  IDK_ID,
  LimitedCardUnderReviewStore,
} from "../shared/card/card.tsx";
import { Button } from "../../ui/button.tsx";
import { t } from "../../translations/t.ts";
import { assert } from "api";

type Props = {
  card?: LimitedCardUnderReviewStore | null;
  onWrong: () => void;
  onCorrect: () => void;
  onShowAnswer: () => void;
  onReviewCardWithAnswers: () => void;
  onHideCardForever: () => void;
};

export function CardReviewWithControls(props: Props) {
  const {
    card,
    onWrong,
    onCorrect,
    onShowAnswer,
    onReviewCardWithAnswers,
    onHideCardForever,
  } = props;

  return (
    <>
      <div
        className={`relative w-full ${
          card?.answerType === "choice_single" ? "h-[400px]" : "h-[350px]"
        }`}
      >
        {card && <Card card={card} onHideCardForever={onHideCardForever} />}
      </div>
      {card && card.answerType === "remember" && (
        <div className="sticky bottom-8 flex items-center gap-4 w-card [&>button]:flex-1">
          {card.isOpened ? (
            <>
              <Button key={"forgot"} onClick={() => onWrong()} outline>
                {t("review_need_to_repeat")}
              </Button>
              <Button key={"remember"} onClick={() => onCorrect()}>
                {t("review_right")}
              </Button>
            </>
          ) : (
            <Button
              key={"show"}
              onClick={() => {
                onShowAnswer();
              }}
            >
              {t("review_show_answer")}
            </Button>
          )}
        </div>
      )}

      {card && card.answerType === "choice_single" && !card.isOpened && (
        <div className="absolute bottom-12 flex flex-col items-center gap-1 w-card [&>button]:flex-1">
          {card.answers.map((answer) => (
            <Button
              key={answer.id}
              onClick={() => {
                assert(card);
                card.openWithAnswer(answer);
              }}
            >
              {answer.text}
            </Button>
          ))}
          <Button
            onClick={() => {
              assert(card);
              card.openWithAnswer({ id: IDK_ID, text: "", isCorrect: false });
            }}
          >
            {t("review_idk")}
          </Button>
        </div>
      )}

      {card && card.answerType === "choice_single" && card.isOpened && (
        <div className="absolute bottom-12 flex items-center gap-4 w-card [&>button]:flex-1">
          <Button
            onClick={() => {
              onReviewCardWithAnswers();
            }}
          >
            {t("next")}
          </Button>
        </div>
      )}
    </>
  );
}
