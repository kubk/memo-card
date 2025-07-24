import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { screenStore } from "../../store/screen-store.ts";
import { platform } from "../../lib/platform/platform.ts";
import { landingLanguages, links } from "api";
import { t } from "../../translations/t.ts";
import { userStore } from "../../store/user-store.ts";

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
              let link = links.landing;
              // @ts-expect-error landing languages is a subset of all available app languages
              if (landingLanguages.includes(userStore.language)) {
                link += `/${userStore.language}`;
              }
              platform.openExternalLink(link);
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
