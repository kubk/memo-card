import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { Choice } from "./choice.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { t } from "../../translations/t.ts";

export const DeckOrFolderChoose = observer(() => {
  useBackButton(() => {
    screenStore.back();
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
        gap: 12,
      })}
    >
      <h3>{t("choose_what_to_create")}</h3>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 8,
        })}
      >
        <Choice
          icon={"mdi mdi-cards-outline mdi-36px"}
          title={t("deck")}
          description={t("deck_description")}
          onClick={() => {
            screenStore.go({ type: "deckForm" });
          }}
        />
        <Choice
          icon={"mdi mdi-folder-open-outline mdi-36px"}
          title={t("folder")}
          description={t("folder_description")}
          onClick={() => {
            screenStore.go({ type: "folderForm" });
          }}
        />
      </div>
    </div>
  );
});
