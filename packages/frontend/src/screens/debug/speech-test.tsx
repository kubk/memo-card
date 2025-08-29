import { useState, useEffect } from "react";
import EasySpeech from "easy-speech";
import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import {
  SpeakLanguageEnum,
  languageKeyToHuman,
} from "../../lib/voice-playback/speak.ts";
import { Select } from "../../ui/select.tsx";

export function SpeechTest() {
  const [selectedLanguage, setSelectedLanguage] = useState<SpeakLanguageEnum>(
    SpeakLanguageEnum.USEnglish,
  );
  const [text, setText] = useState("car");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useBackButton(() => {
    screenStore.back();
  });

  // Initialize EasySpeech and load voices
  useEffect(() => {
    const initSpeech = async () => {
      try {
        await EasySpeech.init({ maxTimeout: 5000, interval: 250 });
        setIsInitialized(true);
        loadVoices();
      } catch (error) {
        console.error("Failed to initialize EasySpeech:", error);
      }
    };

    initSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load voices when language changes
  useEffect(() => {
    if (isInitialized) {
      loadVoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, isInitialized]);

  const loadVoices = () => {
    const filteredVoices = EasySpeech.filterVoices({
      language: selectedLanguage,
    });
    setVoices(filteredVoices);

    // Auto-select first voice if available
    if (filteredVoices.length > 0) {
      setSelectedVoice(`${filteredVoices[0].name}|${filteredVoices[0].lang}`);
    } else {
      setSelectedVoice("");
    }
  };

  const handleSpeak = async () => {
    if (!text.trim() || !selectedVoice || isPlaying) {
      return;
    }

    const [voiceName, voiceLang] = selectedVoice.split("|");
    const voice = voices.find(
      (v) => v.name === voiceName && v.lang === voiceLang,
    );
    if (!voice) {
      console.warn("Selected voice not found");
      return;
    }

    setIsPlaying(true);
    try {
      await EasySpeech.speak({
        text: text.trim(),
        voice,
      });
    } catch (error) {
      console.error("Speech synthesis failed:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const languageOptions = Object.entries(SpeakLanguageEnum).map(
    ([key, value]) => ({
      label: languageKeyToHuman(key),
      value: value,
    }),
  );

  const voiceOptions = voices.map((voice) => ({
    label: `${voice.name} (${voice.lang})`,
    value: `${voice.name}|${voice.lang}`,
  }));

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold text-text">Speech Synthesis Test</h1>

      {!isInitialized && (
        <div className="text-hint">Initializing speech synthesis...</div>
      )}

      {isInitialized && (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-text font-medium">Language:</label>
            <Select
              value={selectedLanguage}
              onChange={(newValue) =>
                setSelectedLanguage(newValue as SpeakLanguageEnum)
              }
              options={languageOptions}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-text font-medium">Text to speak:</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="py-3.5 px-2.5 text-base border-2 border-solid rounded-xl bg-bg border-secondary-bg focus:outline-none focus:border-button transition-colors duration-300"
              placeholder="Enter text to speak..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-text font-medium">
              Voice ({voices.length} available):
            </label>
            {voices.length > 0 ? (
              <Select
                value={selectedVoice}
                onChange={(newValue) => setSelectedVoice(newValue as string)}
                options={voiceOptions}
              />
            ) : (
              <div className="text-hint">
                No voices available for selected language
              </div>
            )}
          </div>

          <button
            onClick={handleSpeak}
            disabled={!text.trim() || !selectedVoice || isPlaying}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
          >
            {isPlaying ? "Speaking..." : "Speak"}
          </button>

          {voices.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-text font-medium">Voice Details:</h3>
              <div className="text-sm text-hint">
                {voices.map((voice) => (
                  <div key={`${voice.name}|${voice.lang}`} className="py-1">
                    <strong>{voice.name}</strong> - {voice.lang}
                    {voice.default && " (default)"}
                    {voice.localService && " (local)"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
