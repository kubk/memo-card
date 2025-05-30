import { VoicePlayer } from "../../deck-review/voice-player/create-voice-player.ts";
import { throttle } from "../../../lib/throttle/throttle.ts";

type PreviewSpeakerParams = {
  player: VoicePlayer | null;
};

export function PreviewSpeaker(props: PreviewSpeakerParams) {
  const { player } = props;

  return (
    <i
      onClick={throttle(() => player?.play(), 500)}
      className="mdi mdi-play-circle mdi-36px cursor-pointer text-button"
    />
  );
}
