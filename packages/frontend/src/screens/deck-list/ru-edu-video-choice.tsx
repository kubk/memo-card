import { BooleanToggle } from "mobx-form-lite";
import { BottomSheet } from "../../ui/bottom-sheet/bottom-sheet.tsx";
import { Flex } from "../../ui/flex.tsx";
import { Choice } from "./deck-or-folder-choose/choice.tsx";
import { platform } from "../../lib/platform/platform.ts";
import { links } from "api";

type Props = { toggle: BooleanToggle };

export function RuEduVideoChoice(props: Props) {
  const { toggle } = props;

  return (
    <BottomSheet
      isOpen={toggle.value}
      onClose={() => {
        toggle.setFalse();
      }}
    >
      <Flex
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        mb={80}
        gap={48}
        fullWidth
      >
        <Flex fullWidth direction={"column"} gap={8}>
          <h3 className="text-center mb-2">Где смотреть уроки</h3>
          <Choice
            title={"YouTube"}
            description={"Если нет проблем с YouTube"}
            onClick={() => {
              platform.openExternalLink(links.youtubeChannelRu);
            }}
          />
          <Choice
            title={"Telegram"}
            description={"Если проблемы с YouTube"}
            onClick={() => {
              platform.openInternalLink(links.telegramRuVideosFirst);
            }}
          />
        </Flex>
      </Flex>
    </BottomSheet>
  );
}
