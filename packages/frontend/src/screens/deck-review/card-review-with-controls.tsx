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

type Props = {
  card?: LimitedCardUnderReviewStore | null;
  onAgain: () => void;
  onHard: () => void;
  onGood: () => void;
  onEasy: () => void;
  onShowAnswer: () => void;
  onReviewCardWithAnswers: () => void;
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
  } = props;

  return (
    <>
      <div className="relative -mt-[72px] w-full">
        {card && <Card card={card} />}
      </div>
      {card && card.answerType === "remember" && (
        <div className="flex absolute bottom-16 gap-2 w-full [&>button]:flex-1">
          {card.isOpened ? (
            <div className="bg-bg flex gap-2 w-full p-2 rounded-2xl">
              <button
                key={"again"}
                onClick={() => onAgain()}
                className="cursor-pointer py-2 flex-auto bg-rose-50 text-rose-700 border border-rose-50/50 dark:border-rose-700/50 rounded-xl active:scale-95 relative"
              >
                <Hotkey
                  shortcut="1"
                  className="bg-rose-50 text-rose-700 border-rose-200 border-2 dark:bg-rose-900/60 dark:text-rose-300 dark:border-rose-700"
                />
                <div className="flex flex-col items-center">
                  <span className="whitespace-nowrap text-sm font-semibold">
                    {t("review_again")}
                  </span>
                  <span className="text-xs opacity-70 font-semibold">
                    {getTimeEstimate("again", card, userStore.language)}
                  </span>
                </div>
              </button>
              <button
                key={"hard"}
                onClick={() => onHard()}
                className="cursor-pointer py-2 flex-auto bg-amber-100 text-amber-800 dark:bg-yellow-900/60 dark:text-yellow-300 border border-amber-100/50 dark:border-yellow-700/50 rounded-xl active:scale-95 relative"
              >
                <Hotkey
                  shortcut="2"
                  className="bg-amber-100 text-amber-800 border-amber-200 border-2 dark:bg-yellow-900/60 dark:text-yellow-300 dark:border-yellow-700"
                />
                <div className="flex flex-col items-center">
                  <span className="whitespace-nowrap text-sm font-semibold">
                    {t("review_hard")}
                  </span>
                  <span className="text-xs opacity-70 font-semibold">
                    {getTimeEstimate("hard", card, userStore.language)}
                  </span>
                </div>
              </button>
              <button
                key={"good"}
                onClick={() => onGood()}
                className="cursor-pointer py-2 flex-auto bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 border border-green-100/50 dark:border-green-700/50 rounded-xl active:scale-95 relative"
              >
                <Hotkey
                  shortcut="3"
                  className="bg-green-100 text-green-800 border-green-200 border-2 dark:bg-green-900/60 dark:text-green-300 dark:border-green-700"
                />
                <div className="flex flex-col items-center">
                  <span className="whitespace-nowrap text-sm font-semibold">
                    {t("review_good")}
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
                  className="cursor-pointer py-2 flex-auto bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300 border border-sky-100/50 dark:border-sky-700/50 rounded-xl active:scale-95 relative"
                >
                  <Hotkey
                    shortcut="4"
                    className="bg-sky-100 text-sky-800 border-sky-200 border-2 dark:bg-sky-900/60 dark:text-sky-300 dark:border-sky-700"
                  />
                  <div className="flex flex-col items-center">
                    <span className="whitespace-nowrap text-sm font-semibold">
                      {t("review_easy")}
                    </span>
                    <span className="text-xs opacity-70 font-semibold">
                      {getTimeEstimate("easy", card, userStore.language)}
                    </span>
                  </div>
                </button>
              )}
            </div>
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
