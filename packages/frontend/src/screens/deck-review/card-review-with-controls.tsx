import React from "react";
import {
  Card,
  IDK_ID,
  LimitedCardUnderReviewStore,
} from "../shared/card/card.tsx";
import { Button } from "../../ui/button.tsx";
import { Hotkey } from "../../ui/hotkey.tsx";
import { t } from "../../translations/t.ts";
import { getTimeEstimate } from "./get-time-estimate.ts";
import { userStore } from "../../store/user-store.ts";
import {
  reviewOutcomeButtonStyles,
  reviewOutcomeHotkeyStyles,
  reviewOutcomeLabels,
} from "./shared/review-outcome-styles.ts";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { cn } from "../../ui/cn.ts";

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
  const bottomControlsClassName = cn(
    "absolute flex w-full",
    platform instanceof BrowserPlatform &&
      platform.isMobile &&
      "bottom-12",
    (!(platform instanceof BrowserPlatform) || !platform.isMobile) &&
      "bottom-4",
  );

  return (
    <>
      <div className="relative -mt-[72px] w-full">
        {card && <Card card={card} />}
      </div>
      {card && card.answerType === "remember" && (
        <div className={cn(bottomControlsClassName, "gap-2 [&>button]:flex-1")}>
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
        <div
          className={cn(
            bottomControlsClassName,
            "flex-col items-center gap-1 [&>button]:flex-1",
          )}
        >
          {card.answers.map((answer) => (
            <Button
              key={answer.id}
              onClick={() => {
                card.openWithAnswer(answer);
              }}
            >
              {answer.text}
            </Button>
          ))}
          <Button
            onClick={() => {
              card.openWithAnswer({ id: IDK_ID, text: "", isCorrect: false });
            }}
          >
            {t("review_idk")}
          </Button>
        </div>
      )}
      {card && card.answerType === "choice_single" && card.isOpened ? (
        <div
          className={cn(
            bottomControlsClassName,
            "items-center gap-4 [&>button]:flex-1",
          )}
        >
          {cardOpenedRow || (
            <Button
              onClick={() => {
                onReviewCardWithAnswers();
              }}
            >
              {t("next")}
            </Button>
          )}
        </div>
      ) : null}
    </>
  );
}
