import { createInitialFsrsReviewState } from "api";
import { useState } from "preact/compat";
import { BrowserWebSpeechApiPlayer } from "../src/screens/deck-review/voice-player/browser-web-speech-api-player.ts";
import { GoogleTtsVoicePlayer } from "../src/screens/deck-review/voice-player/google-tts-voice-player.ts";
import {
  Card,
  type LimitedCardUnderReviewStore,
} from "../src/screens/shared/card/card.tsx";
import {
  isSpeechSynthesisSupported,
  SpeakLanguageEnum,
} from "../src/lib/voice-playback/speak.ts";
import { PreviewFrame } from "./ui/preview-frame.tsx";

const cardExample = {
  id: 1,
  cardReviewType: "new",
  ...createInitialFsrsReviewState(new Date()),
  isOpened: true,
  deckSpeakField: "front",
  front: "Fierce",
  back: "Свирепый",
  example: null,
  answerType: "remember",
  answers: [],
  openWithAnswer: () => {},
  open: () => {},
  isAgain: false,
  isCardSpeakerVisible: (side: "front" | "back") => side === "front",
} satisfies Omit<LimitedCardUnderReviewStore, "speak">;

export function CardAudioPlayground() {
  const [players] = useState(() => [
    {
      label: "Google TTS",
      player: new GoogleTtsVoicePlayer("en-US", cardExample.front),
    },
    {
      label: "Browser TTS",
      player: new BrowserWebSpeechApiPlayer(
        cardExample.front,
        SpeakLanguageEnum.USEnglish,
      ),
    },
  ]);

  return (
    <PreviewFrame>
      <div className="w-full space-y-6">
        {players.map(({ label, player }) => (
          <section key={label} className="space-y-2">
            <h2 className="text-sm font-semibold text-text">{label}</h2>
            <div className="[&>div]:min-h-44">
              <Card
                card={{
                  ...cardExample,
                  voicePlayer: player,
                  speak: () => player.play(),
                }}
              />
            </div>
          </section>
        ))}
        {!isSpeechSynthesisSupported && (
          <p className="text-sm text-hint">
            Browser TTS is unavailable in this browser
          </p>
        )}
      </div>
    </PreviewFrame>
  );
}
