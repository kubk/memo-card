import { throttle } from "../../../lib/throttle/throttle.ts";
import { LimitedCardUnderReviewStore } from "./card.tsx";

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
    <i
      onClick={throttle(card.speak, 500)}
      className="mdi mdi-play-circle mdi-24px cursor-pointer relative top-[3px] text-button"
    />
  );
}
