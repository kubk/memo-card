import { screenStore } from "../../../store/screen-store.ts";
import { t } from "../../../translations/t.ts";
import { Flex } from "../../../ui/flex.tsx";
import { Choice } from "./choice.tsx";
import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { BooleanToggle } from "mobx-form-lite";

type Props = { toggle: BooleanToggle };

export function DeckOrFolderChoose(props: Props) {
  const { toggle } = props;

  return (
    <BottomSheet isOpen={toggle.value} onClose={() => toggle.setFalse()}>
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        mb={80}
        gap={48}
        fullWidth
      >
        <h3>{t("choose_what_to_create")}</h3>
        <Flex fullWidth direction={"column"} gap={8}>
          <Choice
            icon={"mdi mdi-folder-open-outline mdi-36px"}
            title={t("folder")}
            description={t("folder_description")}
            onClick={() => {
              screenStore.go({ type: "folderForm" });
            }}
          />
          <Choice
            icon={"mdi mdi-cards-outline mdi-36px"}
            title={t("deck")}
            description={t("deck_description")}
            onClick={() => {
              screenStore.goToDeckForm({});
            }}
          />
        </Flex>
      </Flex>
    </BottomSheet>
  );
}
