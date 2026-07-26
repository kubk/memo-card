import { userStore } from "../../../store/user-store.ts";
import { ReverseCardsPreview } from "./reverse-cards-preview.tsx";

export function PaywallModals() {
  return (
    <ReverseCardsPreview
      showUpgrade
      onClose={userStore.closePaywall}
      isOpen={userStore.selectedPaywall === "reverse_cards"}
    />
  );
}
