import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { BottomSheetTitle } from "../../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { t } from "../../../translations/t.ts";
import { MassCreationBody } from "./mass-creation-body.tsx";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  showUpgrade?: boolean;
};

export function MassCreationPreview(props: Props) {
  const { onClose, isOpen, showUpgrade } = props;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <Flex direction={"column"} alignItems={"center"} pb={24}>
        <BottomSheetTitle title={t("how")} onClose={onClose} />
        <MassCreationBody showUpgrade={showUpgrade} />
      </Flex>
    </BottomSheet>
  );
}
