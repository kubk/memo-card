import { t } from "../../translations/t.ts";
import { ErrorScreenLayout } from "./error-screen.tsx";

export function DeckNotFoundScreen() {
  return (
    <ErrorScreenLayout
      title={t("deck_not_found")}
      message={t("think_error_contact_support")}
    />
  );
}
