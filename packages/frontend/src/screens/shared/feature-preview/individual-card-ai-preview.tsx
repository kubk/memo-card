import { CardInputModeDb } from "api";
import { BottomSheet } from "../../../ui/bottom-sheet/bottom-sheet.tsx";
import { Flex } from "../../../ui/flex.tsx";
import { BottomSheetTitle } from "../../../ui/bottom-sheet/bottom-sheet-title.tsx";
import { t } from "../../../translations/t.ts";
import { UpgradeProBlock } from "./upgrade-pro-block.tsx";
import { CardPaywallPreview } from "./card-paywall-preview.tsx";
import { ReadonlyInput } from "./readonly-input.tsx";
import { LanguagesIcon } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  viewMode: CardInputModeDb | null;
  showUpgrade?: boolean;
};

export function IndividualCardAiPreview(props: Props) {
  const { isOpen, onClose, viewMode, showUpgrade } = props;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {(() => {
        if (!viewMode) {
          return null;
        }

        return (
          <Flex direction={"column"} alignItems={"center"} pb={24}>
            <BottomSheetTitle title={viewMode.title} onClose={onClose} />
            <div className="flex flex-col gap-3 w-[250px]">
              <ReadonlyInput
                value={viewMode.previewFront}
                label={t("card_input_mode_type")}
              />

              <div>
                <div className="font-semibold text-sm mb-1">
                  {t("card_input_mode_get")}
                </div>

                <CardPaywallPreview
                  size="big"
                  front={viewMode.previewFront}
                  back={viewMode.previewBack}
                  example={viewMode.previewExample}
                />
              </div>

              <div className="flex gap-1 items-center text-sm text-hint mt-2 justify-center">
                <LanguagesIcon className="h-4 w-4" />
                {t("ai_card_input_mode_supports")}
              </div>

              {showUpgrade && <UpgradeProBlock />}
            </div>
          </Flex>
        );
      })()}
    </BottomSheet>
  );
}
