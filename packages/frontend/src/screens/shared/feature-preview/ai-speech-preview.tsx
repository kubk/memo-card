import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { BottomSheetTitle } from "../../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { useState } from "react";
import { createVoicePlayer } from "../../deck-review/voice-player/create-voice-player.ts";
import { SpeakLanguageEnum } from "../../../lib/voice-playback/speak.ts";
import { UpgradeProBlock } from "./upgrade-pro-block.tsx";
import { Play, Mic, LanguagesIcon, Star } from "lucide-react";
import { throttle } from "../../../lib/throttle/throttle.ts";
import { t } from "../../../translations/t.ts";
import { cn } from "../../../ui/cn.ts";
import { userStore } from "../../../store/user-store.ts";

const roboticText = "Life is beautiful";
const aiSpeechUrl =
  "https://fzmgcxtfktdfwvimqcvy.supabase.co/storage/v1/object/public/ai_speech/694b5b30-1b27-4590-842e-028cab8372c1.mp3";

type Props = {
  onClose: () => void;
  showUpgrade?: boolean;
  isOpen: boolean;
};

export function AiSpeechPreview(props: Props) {
  const { onClose, isOpen, showUpgrade } = props;
  const [playerRobotic] = useState(() =>
    createVoicePlayer(
      { front: roboticText, back: "", voice: null },
      {
        speakingCardsLocale: SpeakLanguageEnum.USEnglish,
        speakingCardsField: "front",
      },
    ),
  );
  const [playerAiSpeech] = useState(() =>
    createVoicePlayer(
      { front: "", back: "", voice: aiSpeechUrl },
      { speakingCardsLocale: null, speakingCardsField: null },
    ),
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <BottomSheetTitle title={t("ai_speech_title")} onClose={onClose} />

      <div className="flex justify-center">
        <div className="space-y-6 self-stretch  w-[90%] max-w-[500px]">
          <div className="space-y-4">
            <div className="bg-bg rounded-2xl p-4 transition-all border dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-hint" />
                  <span className="text-text font-medium">
                    {t("ai_speech_preview_free_title")}
                  </span>
                </div>
                <div className="bg-secondary-bg text-xs text-hint px-2 py-1 rounded-full">
                  {t("ai_speech_preview_free_lbl")}
                </div>
              </div>
              <p className="text-hint text-sm mb-3">
                {t("ai_speech_preview_free_desc")}
              </p>
              <button
                onClick={throttle(() => playerRobotic?.play(), 500)}
                className="flex items-center gap-2 justify-center bg-secondary-bg rounded-xl p-2 w-full transition-colors"
              >
                <Play
                  className={cn("h-4 w-4", {
                    "rotate-180": userStore.isRtl,
                  })}
                />
                <span className="text-text text-sm">
                  {t("ai_speech_listen")}
                </span>
              </button>
            </div>

            <div className="bg-bg rounded-2xl p-4 shadow transition-all border dark:border-button relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-button opacity-10 rounded-full blur-xl"></div>
              <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-button opacity-10 rounded-full blur-xl"></div>

              <div className="flex items-center justify-between mb-3 relative">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-button" />
                  <span className="text-text font-medium">
                    {t("ai_speech_preview_pro_title")}
                  </span>
                </div>
                <div className="flex gap-1 items-center text-xs text-button px-2 py-1 rounded-full">
                  Pro
                  <Star size={12} className="fill-current" />
                </div>
              </div>
              <p className="text-hint text-sm mb-3">
                {t("ai_speech_preview_pro_desc")}
              </p>
              <button
                onClick={throttle(() => playerAiSpeech?.play(), 500)}
                className="flex items-center gap-2 justify-center bg-button rounded-xl p-2 w-full transition-colors"
              >
                <Play
                  className={cn("h-4 w-4 text-button-text", {
                    "rotate-180": userStore.isRtl,
                  })}
                />
                <span className="text-button-text text-sm">
                  {t("ai_speech_listen")}
                </span>
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-center">
              <LanguagesIcon className="h-4 w-4 text-hint" />
              <span className="text-hint text-sm">
                {t("ai_speech_lang_support")}
              </span>
            </div>

            {showUpgrade && <UpgradeProBlock />}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
