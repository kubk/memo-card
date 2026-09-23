import { createInitialFsrsReviewState, type DeckCardDbType } from "api";
import { useState } from "react";
import { CardReviewWithControls } from "../src/screens/deck-review/card-review-with-controls.tsx";
import type { LimitedCardUnderReviewStore } from "../src/screens/shared/card/card.tsx";
import { Tabs, TabsList, TabsTrigger } from "../src/ui/shadcn/tabs.tsx";
import { ReviewScreenLayout } from "../src/screens/deck-review/review-screen-layout.tsx";
import { PropGroup } from "./ui/prop-controls.tsx";
import { PropsPanel } from "./ui/props-panel.tsx";

type CardType = "regular" | "choices";
type CardAnswer = NonNullable<DeckCardDbType["answers"]>[number];

const choiceAnswers: CardAnswer[] = [
  { id: "dismal", text: "Унылый", isCorrect: true },
  { id: "gloomy", text: "Мрачный", isCorrect: false },
  { id: "cheerful", text: "Радостный", isCorrect: false },
];

const reviewState = createInitialFsrsReviewState(new Date());

export function CardReviewPlayground() {
  const [cardType, setCardType] = useState<CardType>("regular");
  const [isOpened, setIsOpened] = useState(true);
  const [answer, setAnswer] = useState<CardAnswer>();

  const selectCardType = (value: string) => {
    if (value !== "regular" && value !== "choices") {
      return;
    }

    setCardType(value);
    setIsOpened(value === "regular");
    setAnswer(undefined);
  };

  const resetCard = () => {
    setIsOpened(false);
    setAnswer(undefined);
  };

  const card = {
    id: 1,
    cardReviewType: "new",
    ...reviewState,
    isOpened,
    deckSpeakField: null,
    speak: () => {},
    front: "dismal",
    back: "унылый",
    example: "The weather was dismal, with grey skies and constant rain",
    answerType: cardType === "regular" ? "remember" : "choice_single",
    answers: cardType === "regular" ? [] : choiceAnswers,
    answer,
    openWithAnswer: (selectedAnswer: CardAnswer) => {
      setAnswer(selectedAnswer);
      setIsOpened(true);
    },
    open: () => setIsOpened(true),
    isAgain: false,
    isCardSpeakerVisible: () => false,
  } satisfies LimitedCardUnderReviewStore;

  return (
    <>
      <ReviewScreenLayout>
        <CardReviewWithControls
          card={card}
          onAgain={resetCard}
          onHard={resetCard}
          onGood={resetCard}
          onEasy={resetCard}
          onShowAnswer={() => setIsOpened(true)}
          onReviewCardWithAnswers={resetCard}
        />
      </ReviewScreenLayout>

      <PropsPanel>
        <PropGroup label="Card type">
          <Tabs value={cardType} onValueChange={selectCardType}>
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="regular">
                Regular
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="choices">
                With choices
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </PropGroup>
      </PropsPanel>
    </>
  );
}
