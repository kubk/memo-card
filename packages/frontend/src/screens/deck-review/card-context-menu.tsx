import { EyeOffIcon, MicIcon, MicOffIcon, SkipForwardIcon } from "lucide-react";
import { platform } from "../../lib/platform/platform.ts";
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
          icon: <SkipForwardIcon className="h-5 w-5 text-hint" />,
          text: t("skip_card_for_now"),
          onClick: () => {
            reviewStore.onSkipCard();
          },
        },
        {
          icon: <EyeOffIcon className="h-5 w-5 text-hint" />,
          text: t("hide_card_forever"),
          onClick: () => {
            reviewStore.onHideCardForever();
          },
        },
        card.voicePlayer
          ? {
              icon: userStore.isSpeakingCardsMuted.value ? (
                <MicIcon className="h-5 w-5 text-hint" />
              ) : (
                <MicOffIcon className="h-5 w-5 text-hint" />
              ),
              text: userStore.isSpeakingCardsMuted.value
                ? t("unmute_cards")
                : t("mute_cards"),
              onClick: () => {
                userStore.isSpeakingCardsMuted.toggle();
                platform.haptic("selection");
              },
            }
          : undefined,
      ].filter(boolNarrow)}
    />
  );
}
