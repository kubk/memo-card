import { BotIcon } from "lucide-react";
import { screenStore } from "../../store/screen-store.ts";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { HintTransparent } from "../../ui/hint-transparent.tsx";
import { List, type ListItemType } from "../../ui/list.tsx";
import { userStore } from "../../store/user-store.ts";
import { mcpT } from "./translations.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";

export function McpSettingsEntry({
  title,
  trailingItems = [],
}: {
  title?: string;
  trailingItems?: ListItemType[];
}) {
  return (
    <div className="mt-1">
      <List
        items={[
          {
            icon: (
              <FilledIcon
                className="bg-icon-violet"
                icon={<BotIcon size={18} />}
              />
            ),
            text: title ?? mcpT("settingsTitle"),
            right: <ChevronIcon direction="right" className="text-hint" />,
            onClick: () => {
              screenStore.push(
                userStore.isPaid
                  ? { type: "mcpSettings" }
                  : { type: "plans", planType: "pro" },
              );
            },
          },
          ...trailingItems,
        ]}
      />
      <HintTransparent>{mcpT("settingsHint")}</HintTransparent>
    </div>
  );
}
