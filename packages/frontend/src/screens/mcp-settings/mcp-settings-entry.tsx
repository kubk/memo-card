import { BotIcon } from "lucide-react";
import { screenStore } from "../../store/screen-store.ts";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { List } from "../../ui/list.tsx";
import { theme } from "../../ui/theme.tsx";
import { mcpT } from "./translations.ts";

export function McpSettingsEntry() {
  return (
    <div className="mt-1">
      <List
        items={[
          {
            icon: (
              <FilledIcon
                backgroundColor={theme.icons.violet}
                icon={<BotIcon size={18} />}
              />
            ),
            text: mcpT("settingsTitle"),
            onClick: () => {
              screenStore.push({ type: "mcpSettings" });
            },
          },
        ]}
      />
      <HintTransparent>{mcpT("settingsHint")}</HintTransparent>
    </div>
  );
}
