import { createInitialFsrsReviewState, type DeckCardDbType } from "api";
import { useState } from "preact/compat";
import { CardReviewWithControls } from "../src/screens/deck-review/card-review-with-controls.tsx";
import type { LimitedCardUnderReviewStore } from "../src/screens/shared/card/card.tsx";
import { Tabs, TabsList, TabsTrigger } from "../src/ui/shadcn/tabs.tsx";
import { ReviewScreenLayout } from "../src/screens/deck-review/review-screen-layout.tsx";
import { BooleanProp, PropGroup } from "./ui/prop-controls.tsx";
import { PropsPanel } from "./ui/props-panel.tsx";

type CardType = "regular" | "choices";
type CardAnswer = NonNullable<DeckCardDbType["answers"]>[number];

const choiceAnswers: CardAnswer[] = [
  { id: "dismal", text: "Унылый", isCorrect: true },
  { id: "gloomy", text: "Мрачный", isCorrect: false },
  { id: "cheerful", text: "Радостный", isCorrect: false },
];

const longText = (sentences: number) =>
  Array.from(
    { length: sentences },
    () => "The weather was dismal, with grey skies and constant rain",
  ).join(". ");

const reviewState = createInitialFsrsReviewState(new Date());

export function CardReviewPlayground() {
  const [cardType, setCardType] = useState<CardType>("regular");
  const [isOpened, setIsOpened] = useState(true);
  const [answer, setAnswer] = useState<CardAnswer>();
  const [isLongContent, setIsLongContent] = useState(false);

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

  const answers = isLongContent
    ? choiceAnswers.map((choiceAnswer) => ({
        ...choiceAnswer,
        text: `${choiceAnswer.text}. ${longText(2)}`,
      }))
    : choiceAnswers;

  const card = {
    id: 1,
    cardReviewType: "new",
    ...reviewState,
    isOpened,
    deckSpeakField: null,
    speak: () => {},
    front: isLongContent ? longText(40) : "dismal",
    back: "унылый",
    example: isLongContent
      ? longText(40)
      : "The weather was dismal, with grey skies and constant rain",
    answerType: cardType === "regular" ? "remember" : "choice_single",
    answers: cardType === "regular" ? [] : answers,
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
      <ReviewScreenLayout header={<div className="h-14" />}>
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
        <BooleanProp
          id="card-review-long-content"
          label="Long content"
          checked={isLongContent}
          onCheckedChange={setIsLongContent}
        />
      </PropsPanel>
    </>
  );
}
