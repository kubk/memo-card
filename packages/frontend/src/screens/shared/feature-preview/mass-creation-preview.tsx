import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
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
    <BottomSheet title={t("how")} isOpen={isOpen} onClose={onClose}>
      <Flex direction={"column"} alignItems={"center"} pb={24}>
        <MassCreationBody showUpgrade={showUpgrade} />
      </Flex>
    </BottomSheet>
  );
}
