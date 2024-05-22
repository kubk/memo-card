// disable eslint for the whole file
/* eslint-disable */
import { screenStore } from "../../store/screen-store.ts";
import { observer } from "mobx-react-lite";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
// @ts-ignore
import EasySpeech from "easy-speech";

export const Debug = observer(() => {
  useBackButton(() => {
    screenStore.back();
  });

  return (
    <div>
      <button
        onClick={() => {
          console.log("clicked 1");
          let utterance = new SpeechSynthesisUtterance("hello");
          let voice = speechSynthesis.getVoices()[0];
          utterance.voice = voice;
          speechSynthesis.speak(utterance);
        }}
      >
        Голос 1
      </button>
      <button
        onClick={() => {
          console.log("clicked 1");
          let utterance = new SpeechSynthesisUtterance("hello");
          let voice = speechSynthesis.getVoices()[0];
          utterance.voice = voice; // required for iOS
          utterance.lang = voice.lang; // required for Android Chrome
          // @ts-ignore
          utterance.voiceURI = voice.voiceURI; // unclear if needed
          speechSynthesis.speak(utterance);
        }}
      >
        Голос 2
      </button>

      <button
        onClick={() => {
          EasySpeech.init({ maxTimeout: 5000, interval: 250 }).then(
            async () => {
              await EasySpeech.speak({
                text: "Hello",
                pitch: 1,
                rate: 1,
                volume: 1,
                // @ts-ignore
                boundary: (e) => console.debug("boundary reached"),
              });
            },
          );
        }}
      >
        Голос 3
      </button>
    </div>
  );
});
