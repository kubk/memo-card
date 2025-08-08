import React from "react";
import {
  Card,
  IDK_ID,
  LimitedCardUnderReviewStore,
} from "../shared/card/card.tsx";
import { Button } from "../../ui/button.tsx";
import { Hotkey } from "../../ui/hotkey.tsx";
import { t } from "../../translations/t.ts";
import { assert } from "api";
import { getTimeEstimate } from "./get-time-estimate.ts";
import { userStore } from "../../store/user-store.ts";
import {
  reviewOutcomeButtonStyles,
  reviewOutcomeHotkeyStyles,
  reviewOutcomeLabels,
} from "./shared/review-outcome-styles.ts";

type Props = {
  card?: LimitedCardUnderReviewStore | null;
  onAgain: () => void;
  onHard: () => void;
  onGood: () => void;
  onEasy: () => void;
  onShowAnswer: () => void;
  onReviewCardWithAnswers: () => void;
  cardOpenedRow?: React.ReactNode;
};

export function CardReviewWithControls(props: Props) {
  const {
    card,
    onAgain,
    onHard,
    onGood,
    onEasy,
    onShowAnswer,
    onReviewCardWithAnswers,
    cardOpenedRow,
  } = props;

  return (
    <>
      <div className="relative -mt-[72px] w-full">
        {card && <Card card={card} />}
      </div>
      {card && card.answerType === "remember" && (
        <div className="flex absolute bottom-16 gap-2 w-full [&>button]:flex-1">
          {card.isOpened ? (
            cardOpenedRow ? (
              cardOpenedRow
            ) : (
              <div className="bg-bg flex gap-2 w-full p-2 rounded-2xl">
                <button
                  key={"again"}
                  onClick={() => onAgain()}
                  className={reviewOutcomeButtonStyles.again}
                >
                  <Hotkey
                    shortcut="1"
                    className={reviewOutcomeHotkeyStyles.again}
                  />
                  <div className="flex flex-col items-center">
                    <span className="whitespace-nowrap text-sm font-semibold">
                      {reviewOutcomeLabels.again()}
                    </span>
                    <span className="text-xs opacity-70 font-semibold">
                      {getTimeEstimate("again", card, userStore.language)}
                    </span>
                  </div>
                </button>
                <button
                  key={"hard"}
                  onClick={() => onHard()}
                  className={reviewOutcomeButtonStyles.hard}
                >
                  <Hotkey
                    shortcut="2"
                    className={reviewOutcomeHotkeyStyles.hard}
                  />
                  <div className="flex flex-col items-center">
                    <span className="whitespace-nowrap text-sm font-semibold">
                      {reviewOutcomeLabels.hard()}
                    </span>
                    <span className="text-xs opacity-70 font-semibold">
                      {getTimeEstimate("hard", card, userStore.language)}
                    </span>
                  </div>
                </button>
                <button
                  key={"good"}
                  onClick={() => onGood()}
                  className={reviewOutcomeButtonStyles.good}
                >
                  <Hotkey
                    shortcut="3"
                    className={reviewOutcomeHotkeyStyles.good}
                  />
                  <div className="flex flex-col items-center">
                    <span className="whitespace-nowrap text-sm font-semibold">
                      {reviewOutcomeLabels.good()}
                    </span>
                    <span className="text-xs opacity-70 font-semibold">
                      {getTimeEstimate("good", card, userStore.language)}
                    </span>
                  </div>
                </button>
                {!card.isAgain && (
                  <button
                    key={"easy"}
                    onClick={() => onEasy()}
                    className={reviewOutcomeButtonStyles.easy}
                  >
                    <Hotkey
                      shortcut="4"
                      className={reviewOutcomeHotkeyStyles.easy}
                    />
                    <div className="flex flex-col items-center">
                      <span className="whitespace-nowrap text-sm font-semibold">
                        {reviewOutcomeLabels.easy()}
                      </span>
                      <span className="text-xs opacity-70 font-semibold">
                        {getTimeEstimate("easy", card, userStore.language)}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )
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
        <div className="absolute bottom-12 flex flex-col items-center gap-1 w-full [&>button]:flex-1">
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
        <div className="absolute bottom-12 flex items-center gap-4 w-full [&>button]:flex-1">
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
