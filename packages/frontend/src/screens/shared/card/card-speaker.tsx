import { throttle } from "../../../lib/throttle/throttle.ts";
import { LimitedCardUnderReviewStore } from "./card.tsx";
import { PlayCircle } from "lucide-react";
import "./card-speaker.css";

type Props = {
  card: LimitedCardUnderReviewStore;
  type: "front" | "back";
};

export function CardSpeaker(props: Props) {
  const { card, type } = props;
  if (!card.isCardSpeakerVisible(type)) {
    return null;
  }
  const iconProps = {
    className: "relative top-[3px] text-button",
  };

  // Prevent rapid clicks from queueing overlapping speech.
  return (
    <button
      type="button"
      onClick={throttle(card.speak, 500)}
      className="cursor-pointer touch-manipulation transition-[scale] duration-200 ease-out active:scale-90"
    >
      {card.voicePlayer?.isPlaying ? (
        <svg
          {...iconProps}
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <circle cx={12} cy={12} r={10} />
          <g className="card-speaker-wave">
            <path d="M8 9v6" />
            <path d="M12 7v10" />
            <path d="M16 9v6" />
          </g>
        </svg>
      ) : (
        <PlayCircle {...iconProps} size={24} />
      )}
    </button>
  );
}
