import { t } from "../../translations/t.ts";
import { useMainButton } from "../../lib/platform/use-main-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { Screen } from "../shared/screen.tsx";

export function SharedDeckNotFoundScreen() {
  useMainButton(t("my_decks"), () => {
    screenStore.replace({ type: "main" });
  });

  return (
    <Screen title={t("deck_not_found")}>
      <div className="my-6 self-center text-center">
        {t("deck_was_deleted")}
      </div>
    </Screen>
  );
}
