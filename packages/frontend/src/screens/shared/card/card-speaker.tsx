import { throttle } from "../../../lib/throttle/throttle.ts";
import { LimitedCardUnderReviewStore } from "./card.tsx";
import { PlayCircle } from "lucide-react";

type Props = {
  card: LimitedCardUnderReviewStore;
  type: "front" | "back";
};

export function CardSpeaker(props: Props) {
  const { card, type } = props;
  if (!card.isCardSpeakerVisible(type)) {
    return null;
  }

  // Prevent rapid clicks from queueing overlapping speech.
  return (
    <div
      tabIndex={0}
      className="transition-[scale] duration-200 ease-out active:scale-90"
    >
      <PlayCircle
        onClick={throttle(card.speak, 500)}
        size={24}
        className="cursor-pointer relative top-[3px] text-button"
      />
    </div>
  );
}
