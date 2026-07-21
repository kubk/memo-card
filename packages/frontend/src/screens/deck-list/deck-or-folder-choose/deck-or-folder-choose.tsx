import { screenStore } from "../../../store/screen-store.ts";
import { t } from "../../../translations/t.ts";
import { Flex } from "../../../ui/flex.tsx";
import { Choice } from "./choice.tsx";
import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { BooleanToggle } from "mobx-form-lite";
import { FolderOpen, LayersIcon } from "lucide-react";

type Props = { toggle: BooleanToggle };

export function DeckOrFolderChoose(props: Props) {
  const { toggle } = props;

  return (
    <BottomSheet
      title={t("create")}
      isOpen={toggle.value}
      onClose={() => toggle.setFalse()}
    >
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        mb={48}
        fullWidth
      >
        <Flex fullWidth direction={"column"} gap={8}>
          <Choice
            icon={<LayersIcon className="text-text self-center" size={18} />}
            title={t("create_deck_option")}
            description={t("deck_description")}
            onClick={() => {
              screenStore.push({ type: "deckForm" });
            }}
          />
          <Choice
            icon={<FolderOpen className="text-text self-center" size={18} />}
            title={t("create_folder_option")}
            description={t("folder_description")}
            onClick={() => {
              screenStore.push({ type: "folderForm" });
            }}
          />
        </Flex>
      </Flex>
    </BottomSheet>
  );
}
