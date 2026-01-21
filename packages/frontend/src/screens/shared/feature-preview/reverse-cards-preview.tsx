import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { BottomSheetTitle } from "../../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { UpgradeProBlock } from "./upgrade-pro-block.tsx";
import { t } from "../../../translations/t.ts";

const exampleFront = "apple";
const exampleBack = "manzana";

function MiniCard(props: { front: string; back: string; className?: string }) {
  return (
    <div
      className={`box-border rounded-[12px] text-text flex flex-col items-center justify-center p-3 bg-secondary-bg w-[140px] h-[100px] ${props.className ?? ""}`}
    >
      <div className="font-semibold text-sm">{props.front}</div>
      <div className="w-[80px] my-2 h-[1px] bg-divider dark:bg-[#333]" />
      <div className="font-semibold text-sm">{props.back}</div>
    </div>
  );
}

export function ReverseCardsPreview(props: {
  onClose: () => void;
  isOpen: boolean;
  showUpgrade?: boolean;
}) {
  const { onClose, isOpen, showUpgrade } = props;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <Flex direction={"column"} alignItems={"center"} pb={24}>
        <BottomSheetTitle title={t("reverse_cards_title")} onClose={onClose} />
        <div className="w-[90%] max-w-[520px] flex flex-col gap-6">
          <div className="text-sm text-hint text-center">
            {t("reverse_cards_helper")}
          </div>
          <div className="flex justify-center mb-5 mt-5">
            <div className="relative h-[160px] w-[260px]">
              <MiniCard
                front={exampleFront}
                back={exampleBack}
                className="absolute top-0 start-0 shadow-sm -rotate-6"
              />
              <MiniCard
                front={exampleBack}
                back={exampleFront}
                className="absolute bottom-[0px] end-[0px] shadow-sm rotate-6"
              />
            </div>
          </div>
          {showUpgrade && <UpgradeProBlock />}
        </div>
      </Flex>
    </BottomSheet>
  );
}
