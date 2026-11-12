export const isSpeechSynthesisSupported =
  "speechSynthesis" in window &&
  typeof SpeechSynthesisUtterance !== "undefined";

// iOS speaks without a gesture only after one utterance started during one
export function unlockSpeechSynthesis() {
  if (!isSpeechSynthesisSupported) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(" ");
  utterance.volume = 0;
  speechSynthesis.speak(utterance);
}
