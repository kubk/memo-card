import { IndividualCardAiPreview } from "./individual-card-ai-preview.tsx";
import { MassCreationPreview } from "./mass-creation-preview.tsx";
import { suitableCardInputModeStore } from "../../../store/suitable-card-input-mode-store.ts";
import { userStore } from "../../../store/user-store.ts";
import { AiSpeechPreview } from "./ai-speech-preview.tsx";

export function PaywallModals() {
  return (
    <>
      <IndividualCardAiPreview
        showUpgrade
        viewMode={suitableCardInputModeStore.viewMode}
        isOpen={userStore.selectedPaywall === "individual_ai_card"}
        onClose={userStore.closePaywall}
      />

      <MassCreationPreview
        showUpgrade
        onClose={userStore.closePaywall}
        isOpen={userStore.selectedPaywall === "bulk_ai_cards"}
      />

      <AiSpeechPreview
        showUpgrade
        onClose={userStore.closePaywall}
        isOpen={userStore.selectedPaywall === "ai_speech"}
      />
    </>
  );
}
