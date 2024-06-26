import { observer } from "mobx-react-lite";
import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { t } from "../../translations/t.ts";
import { Flex } from "../../ui/flex.tsx";
import React from "react";
import { Choice } from "../../ui/choice.tsx";

export const DeckOrFolderChoose = observer(() => {
  useBackButton(() => {
    screenStore.back();
  });

  return (
    <Flex
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      mt={100}
      gap={12}
    >
      <h3>{t("choose_what_to_create")}</h3>
      <Flex direction={"column"} gap={8}>
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
      </Flex>
    </Flex>
  );
});
