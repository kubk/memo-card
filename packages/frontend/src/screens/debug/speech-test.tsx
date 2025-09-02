import { useState, useEffect } from "react";
import EasySpeech from "easy-speech";
import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { Select } from "../../ui/select.tsx";
import { speak as customSpeak, SpeakLanguageEnum } from "../../lib/voice-playback/speak.ts";

type Language = {
  code: string;
  name: string;
  defaultText: string;
};

const LANGUAGES: Language[] = [
  { code: "en-US", name: "English (US)", defaultText: "Hello, how are you?" },
  { code: "es-ES", name: "Spanish", defaultText: "Hola, ¿cómo estás?" },
  {
    code: "de-DE",
    name: "German",
    defaultText: "Guten Tag, wie geht es Ihnen?",
  },
  { code: "tr-TR", name: "Turkish", defaultText: "Merhaba, nasılsınız?" },
  { code: "ru-RU", name: "Russian", defaultText: "Привет, как дела?" },
];

type VoiceMethod = "default" | "select" | "custom";

export function SpeechTest() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-US");
  const [text, setText] = useState("Hello, how are you?");
  const [voiceMethod, setVoiceMethod] = useState<VoiceMethod>("default");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useBackButton(() => {
    screenStore.back();
  });

  // Update text when language changes
  useEffect(() => {
    const language = LANGUAGES.find((lang) => lang.code === selectedLanguage);
    if (language) {
      setText(language.defaultText);
    }
  }, [selectedLanguage]);

  // Initialize EasySpeech and load voices
  useEffect(() => {
    const initSpeech = async () => {
      try {
        await EasySpeech.init({ maxTimeout: 5000, interval: 250 });
        setIsInitialized(true);
        if (voiceMethod === "select") {
          loadVoices();
        }
      } catch (error) {
        console.error("Failed to initialize EasySpeech:", error);
      }
    };

    initSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load voices when language or voice method changes
  useEffect(() => {
    if (isInitialized && voiceMethod === "select") {
      loadVoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, isInitialized, voiceMethod]);

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

  const speak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeak = async () => {
    if (!text.trim() || isPlaying) {
      return;
    }

    if (voiceMethod === "default") {
      setIsPlaying(true);
      speak(text.trim(), selectedLanguage);
      setTimeout(() => setIsPlaying(false), 1000);
      return;
    }

    if (voiceMethod === "custom") {
      setIsPlaying(true);
      try {
        await customSpeak(text.trim(), selectedLanguage as SpeakLanguageEnum);
      } catch (error) {
        console.error("Custom speak failed:", error);
      } finally {
        setIsPlaying(false);
      }
      return;
    }

    if (!selectedVoice) {
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

  const voiceOptions = voices.map((voice) => ({
    label: `${voice.name} (${voice.lang})`,
    value: `${voice.name}|${voice.lang}`,
  }));

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold text-text">Speech Synthesis Test</h1>

      {/* Language Tabs */}
      <div className="flex flex-col gap-2">
        <label className="text-text font-medium">Language:</label>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                selectedLanguage === lang.code
                  ? "bg-button text-button-text"
                  : "bg-secondary-bg text-text hover:bg-opacity-80"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Method Tabs */}
      <div className="flex flex-col gap-2">
        <label className="text-text font-medium">Voice Method:</label>
        <div className="flex gap-2">
          <button
            onClick={() => setVoiceMethod("default")}
            className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
              voiceMethod === "default"
                ? "bg-button text-button-text"
                : "bg-secondary-bg text-text hover:bg-opacity-80"
            }`}
          >
            Default
          </button>
          <button
            onClick={() => setVoiceMethod("select")}
            className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
              voiceMethod === "select"
                ? "bg-button text-button-text"
                : "bg-secondary-bg text-text hover:bg-opacity-80"
            }`}
          >
            Select Voice
          </button>
          <button
            onClick={() => setVoiceMethod("custom")}
            className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
              voiceMethod === "custom"
                ? "bg-button text-button-text"
                : "bg-secondary-bg text-text hover:bg-opacity-80"
            }`}
          >
            Custom Speak
          </button>
        </div>
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

      {voiceMethod === "select" && (
        <>
          {!isInitialized && (
            <div className="text-hint">Initializing speech synthesis...</div>
          )}

          {isInitialized && (
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
          )}
        </>
      )}


      <button
        onClick={handleSpeak}
        disabled={
          !text.trim() ||
          isPlaying ||
          (voiceMethod === "select" && (!isInitialized || !selectedVoice))
        }
        className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
      >
        {isPlaying ? "Speaking..." : "Speak"}
      </button>

      {voiceMethod === "select" && voices.length > 0 && (
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
    </div>
  );
}
