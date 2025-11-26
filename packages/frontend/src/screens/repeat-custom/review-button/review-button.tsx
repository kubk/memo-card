import { screenStore } from "../../../store/screen-store.ts";
import { CirclePlayIcon } from "lucide-react";
import { deckListStore } from "../../../store/deck-list-store.ts";
import { cn } from "../../../ui/cn.ts";
import { platform } from "../../../lib/platform/platform.ts";

export function ReviewButton() {
  if (deckListStore.myInfoRequest.isLoading || !deckListStore.myDecks.length) {
    return null;
  }

  return (
    <div className={cn("fixed bottom-6 end-6")}>
      <button
        onClick={() => {
          screenStore.go({ type: "reviewCustom" });
          platform.haptic("light");
        }}
        className="h-14 pt-0.5 w-14 rounded-full bg-button text-white shadow-xl flex items-center justify-center z-20 active:scale-95"
      >
        <CirclePlayIcon className="h-8 w-8 active:scale-95 transition-transform" />
      </button>
    </div>
  );
}
