import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { platform } from "../../lib/platform/platform.ts";
import { links } from "api";
import { t } from "../../translations/t.ts";

export function AboutScreen() {
  useBackButton(() => {
    screenStore.back();
  });

  return (
    <Screen title={t("about_title")}>
      <div className="space-y-4 text-sm leading-relaxed">
        <p>{t("about_paragraph_1")}</p>
        <p>{t("about_paragraph_2")}</p>
        <p>{t("about_paragraph_3")}</p>
        <p>{t("about_paragraph_4")}</p>

        <div className="mt-6 space-y-2">
          <div
            onClick={() => {
              platform.openExternalLink(links.landing);
            }}
            className="text-link inline-block cursor-pointer"
          >
            {t("about_visit_website")}
          </div>
          <br />
          <div
            onClick={() => {
              platform.openExternalLink(links.github);
            }}
            className="text-link inline-block cursor-pointer"
          >
            {t("about_github_frontend")}
          </div>
        </div>
      </div>
    </Screen>
  );
}
