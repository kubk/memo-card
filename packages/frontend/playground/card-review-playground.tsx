import { createInitialFsrsReviewState, type DeckCardDbType } from "api";
import { useState } from "preact/compat";
import { CardReviewWithControls } from "../src/screens/deck-review/card-review-with-controls.tsx";
import type { LimitedCardUnderReviewStore } from "../src/screens/shared/card/card.tsx";
import { Tabs, TabsList, TabsTrigger } from "../src/ui/shadcn/tabs.tsx";
import { ReviewScreenLayout } from "../src/screens/deck-review/review-screen-layout.tsx";
import { BooleanProp, PropGroup, RadioProp } from "./ui/prop-controls.tsx";
import { PropsPanel } from "./ui/props-panel.tsx";
import { UrlRecordVoicePlayer } from "../src/screens/deck-review/voice-player/url-record-voice-player.ts";
import {
  isCardSpeakerVisible,
  speakCard,
  speakCardOnOpen,
  speakCardOnShow,
} from "../src/screens/deck-review/store/card-speaking.ts";

type CardType = "regular" | "choices";
const audioOptions = [
  { id: "none", label: "None" },
  { id: "front", label: "Question" },
  { id: "back", label: "Answer" },
  { id: "listening", label: "Listening: audio only on the question" },
] as const;
type AudioSide = (typeof audioOptions)[number]["id"];

const audioUrl =
  "https://media.memocard.org/415318291.f69cc200-c506-4fec-8e22-b553e4765970-french-in-action-0001.mp3";
const audioContentOptions = [
  { id: "image", label: "Image and text" },
  { id: "word", label: "Word" },
  { id: "heading", label: "Heading" },
  { id: "block", label: "Text block" },
] as const;
type AudioContent = (typeof audioContentOptions)[number]["id"];

const audioContents = {
  image: {
    text: '<img src="https://media.memocard.org/415318291.ecfab41b-e96a-46f5-b566-6b6326f1e044-french-in-action-0001.jpg"><br>Bonjour, Madame Rosa.',
    translation: "Hello, Mrs. Rosa.",
  },
  word: { text: "สาธารณะ", translation: "public" },
  heading: { text: "<h1>สาธารณะ</h1>", translation: "public" },
  block: { text: "<div>สาธารณะ</div>", translation: "public" },
};

const getAudioCardText = (side: AudioSide, content: AudioContent) => {
  const { text, translation } = audioContents[content];
  switch (side) {
    case "none":
      return null;
    case "front":
      return { front: text, back: translation };
    case "back":
      return { front: translation, back: text };
    case "listening":
      return {
        front: "",
        back: "Bonjour, Madame Rosa.<br><br>Hello, Mrs. Rosa.",
      };
  }
};
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
  const [audioSide, setAudioSide] = useState<AudioSide>("none");
  const [audioContent, setAudioContent] = useState<AudioContent>("image");
  const [voicePlayer] = useState(() => new UrlRecordVoicePlayer(audioUrl));

  const getSpeakingCard = (side: AudioSide, opened: boolean) => ({
    voicePlayer: side === "none" ? undefined : voicePlayer,
    isOpened: opened,
    deckSpeakField:
      side === "none" ? null : side === "listening" ? "front" : side,
  });

  const selectAudioSide = (value: string) => {
    if (
      value !== "none" &&
      value !== "front" &&
      value !== "back" &&
      value !== "listening"
    ) {
      return;
    }

    setAudioSide(value);
    setIsOpened(false);
    setAnswer(undefined);
    speakCardOnShow(getSpeakingCard(value, false), true);
  };

  const showAnswer = () => {
    setIsOpened(true);
    speakCardOnOpen(getSpeakingCard(audioSide, true), true);
  };

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
    speakCardOnShow(getSpeakingCard(audioSide, false), true);
  };

  const selectAudioContent = (value: string) => {
    const option = audioContentOptions.find((option) => option.id === value);
    if (option) {
      setAudioContent(option.id);
    }
  };

  const audioCardText = getAudioCardText(audioSide, audioContent);

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
    ...getSpeakingCard(audioSide, isOpened),
    speak: () => speakCard(voicePlayer, true),
    front: audioCardText
      ? audioCardText.front
      : isLongContent
        ? longText(40)
        : "dismal",
    back: audioCardText ? audioCardText.back : "унылый",
    example: audioCardText
      ? null
      : isLongContent
        ? longText(40)
        : "The weather was dismal, with grey skies and constant rain",
    answerType: cardType === "regular" ? "remember" : "choice_single",
    answers: cardType === "regular" ? [] : answers,
    answer,
    openWithAnswer: (selectedAnswer: CardAnswer) => {
      setAnswer(selectedAnswer);
      setIsOpened(true);
    },
    open: showAnswer,
    isAgain: false,
    isCardSpeakerVisible: (side: "front" | "back") =>
      isCardSpeakerVisible(getSpeakingCard(audioSide, isOpened), side, true),
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
          onShowAnswer={showAnswer}
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
        <PropGroup label="Audio">
          <RadioProp
            id="card-review-audio"
            options={audioOptions}
            value={audioSide}
            onValueChange={selectAudioSide}
          />
        </PropGroup>
        {audioSide === "front" || audioSide === "back" ? (
          <PropGroup label="Audio side content">
            <RadioProp
              id="card-review-audio-content"
              options={audioContentOptions}
              value={audioContent}
              onValueChange={selectAudioContent}
            />
          </PropGroup>
        ) : null}
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
