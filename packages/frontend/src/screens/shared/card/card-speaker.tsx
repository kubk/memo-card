import { throttle } from "../../../lib/throttle/throttle.ts";
import { LimitedCardUnderReviewStore } from "./card.tsx";
import { PlayCircle } from "lucide-react";
import "./card-speaker.css";
import { cn } from "../../../ui/cn.ts";

type Props = {
  card: LimitedCardUnderReviewStore;
  type: "front" | "back";
  isLarge?: boolean;
};

export function CardSpeaker(props: Props) {
  const { card, type, isLarge } = props;
  if (!card.isCardSpeakerVisible(type)) {
    return null;
  }
  // Prevent rapid clicks from queueing overlapping speech.
  return (
    <button
      type="button"
      onClick={throttle(card.speak, 500)}
      className={cn(
        "card-speaker cursor-pointer touch-manipulation transition-[scale] duration-200 ease-out active:scale-90",
        isLarge ? "mx-auto mt-4 flex" : "ms-2 inline-flex align-middle",
      )}
    >
      <SpeakerIcon
        isPlaying={!!card.voicePlayer?.isPlaying}
        size={isLarge ? 72 : 24}
      />
    </button>
  );
}

export function SpeakerIcon({
  isPlaying,
  size,
}: {
  isPlaying: boolean;
  size: number;
}) {
  const iconProps = {
    className: "text-button",
    strokeWidth: size > 24 ? 1.5 : 2,
  };

  return isPlaying ? (
    <svg
      {...iconProps}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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
    <PlayCircle {...iconProps} size={size} />
  );
}
