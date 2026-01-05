import { t } from "../../../translations/t";
import { notifySuccess } from "../../shared/snackbar/snackbar";

export function notifyNewCards(cards: unknown[]) {
  // Wait for Telegram's main button to disappear
  setTimeout(() => {
    if (cards.length === 1) {
      notifySuccess(t("card_created"));
    }
    if (cards.length === 2) {
      notifySuccess(t("two_cards_created"));
    }
  }, 300);
}
