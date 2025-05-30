import { Screen } from "../shared/screen.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { links } from "api";
import { Button } from "../../ui/button.tsx";
import { t } from "../../translations/t.ts";

export function ErrorScreen() {
  return (
    <Screen title={t("error")}>
      <div className="self-center my-6">{t("error_contact_support")}</div>
      <Button
        onClick={() => {
          platform.openInternalLink(links.supportChat);
        }}
      >
        {t("settings_contact_support")}
      </Button>
    </Screen>
  );
}
