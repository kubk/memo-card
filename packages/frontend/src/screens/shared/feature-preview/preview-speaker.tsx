import { VoicePlayer } from "../../deck-review/voice-player/create-voice-player.ts";
import { throttle } from "../../../lib/throttle/throttle.ts";
import { PlayCircle } from "lucide-react";

type PreviewSpeakerParams = {
  player: VoicePlayer | null;
};

export function PreviewSpeaker(props: PreviewSpeakerParams) {
  const { player } = props;

  return (
    <PlayCircle
      onClick={throttle(() => player?.play(), 500)}
      size={36}
      className="cursor-pointer text-button"
    />
  );
}
