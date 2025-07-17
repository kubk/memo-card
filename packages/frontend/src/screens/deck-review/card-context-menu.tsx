import { EyeOffIcon, MicIcon, MicOffIcon } from "lucide-react";
import { hapticSelection } from "../../lib/platform/telegram/haptics";
import { boolNarrow } from "../../lib/typescript/bool-narrow";
import { userStore } from "../../store/user-store";
import { t } from "../../translations/t";
import { Dropdown } from "../../ui/dropdown";
import { useReviewStore } from "./store/review-store-context";

export function CardContextMenu() {
  const reviewStore = useReviewStore();
  const card = reviewStore.currentCard;

  if (!card) return null;

  return (
    <Dropdown
      items={[
        {
          icon: <EyeOffIcon className="h-5 w-5 text-button" />,
          text: t("hide_card_forever"),
          onClick: () => {
            reviewStore.onHideCardForever();
          },
        },
        card.voicePlayer
          ? {
              icon: userStore.isSpeakingCardsMuted.value ? (
                <MicIcon className="h-5 w-5 text-button" />
              ) : (
                <MicOffIcon className="h-5 w-5 text-button" />
              ),
              text: userStore.isSpeakingCardsMuted.value
                ? t("unmute_cards")
                : t("mute_cards"),
              onClick: () => {
                userStore.isSpeakingCardsMuted.toggle();
                hapticSelection();
              },
            }
          : undefined,
      ].filter(boolNarrow)}
    />
  );
}
