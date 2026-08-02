import { Screen } from "../shared/screen.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { links } from "api";
import { Button } from "../../ui/button.tsx";
import { t } from "../../translations/t.ts";

export function ErrorScreenLayout({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Screen title={title}>
      <div className="self-center my-6">{message}</div>
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

export function ErrorScreen() {
  return (
    <ErrorScreenLayout
      title={t("error")}
      message={t("error_contact_support")}
    />
  );
}
