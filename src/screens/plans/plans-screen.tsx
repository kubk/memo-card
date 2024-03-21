import { observer } from "mobx-react-lite";
import { Screen } from "../shared/screen.tsx";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { t } from "../../translations/t.ts";
import { Flex } from "../../ui/flex.tsx";
import React from "react";
import { Choice } from "../../ui/choice.tsx";
import { SelectedPlan } from "./selected-plan.tsx";

export const PlansScreen = observer(() => {
  useBackButton(() => {
    screenStore.back();
  });

  return (
    <Screen title={"Plans"}>
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        mt={50}
        gap={12}
      >
        <Flex direction={"column"} gap={8}>
          <SelectedPlan>
            <Choice
              icon={"mdi mdi-cards-outline mdi-36px"}
              title={"Free"}
              outline
            />
          </SelectedPlan>
          <Choice
            icon={"mdi mdi-cards-outline mdi-36px"}
            title={"Plus"}
            description={t("deck_description")}
            onClick={() => {
              screenStore.go({ type: "deckForm" });
            }}
          />
          <Choice
            icon={"mdi mdi-folder-open-outline mdi-36px"}
            title={"Pro"}
            description={t("folder_description")}
            onClick={() => {
              screenStore.go({ type: "folderForm" });
            }}
          />
        </Flex>
      </Flex>
    </Screen>
  );
});
