import { observer } from "mobx-react-lite";
import {
  Card,
  cardSize,
  LimitedCardUnderReviewStore,
} from "../shared/card/card.tsx";
import { css } from "@emotion/css";
import { Button } from "../../ui/button.tsx";
import React from "react";
import { assert } from "../../lib/typescript/assert.ts";
import { t } from "../../translations/t.ts";

type Props = {
  card?: LimitedCardUnderReviewStore | null;
  onWrong: () => void;
  onCorrect: () => void;
  onShowAnswer: () => void;
  onReviewCardWithAnswers: () => void;
};

export const CardReviewWithControls = observer((props: Props) => {
  const { card, onWrong, onCorrect, onShowAnswer, onReviewCardWithAnswers } =
    props;

  return (
    <>
      <div
        className={css({
          height: card?.answerType === "choice_single" ? 400 : 350,
          position: "relative",
          width: "100%",
        })}
      >
        {card && <Card card={card} />}
      </div>
      {card && card.answerType === "remember" && (
        <div
          className={css({
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 16,
            width: cardSize,
            "> button": {
              flex: 1,
            },
          })}
        >
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
        <div
          className={css({
            position: "absolute",
            bottom: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            width: cardSize,
            "> button": {
              flex: 1,
            },
          })}
        >
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
        </div>
      )}

      {card && card.answerType === "choice_single" && card.isOpened && (
        <div
          className={css({
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 16,
            width: cardSize,
            "> button": {
              flex: 1,
            },
          })}
        >
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
});
