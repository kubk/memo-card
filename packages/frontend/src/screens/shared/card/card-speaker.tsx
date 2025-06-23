import { throttle } from "../../../lib/throttle/throttle.ts";
import { LimitedCardUnderReviewStore } from "./card.tsx";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  card: LimitedCardUnderReviewStore;
  type: "front" | "back";
};

export function CardSpeaker(props: Props) {
  const { card, type } = props;
  if (!card.isCardSpeakerVisible(type)) {
    return null;
  }

  // throttle is needed to avoid user clicking on the speaker many times in a row hence creating many sounds
  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <PlayCircle
        onClick={throttle(card.speak, 500)}
        size={24}
        className="cursor-pointer relative top-[3px] text-button"
      />
    </motion.div>
  );
}
