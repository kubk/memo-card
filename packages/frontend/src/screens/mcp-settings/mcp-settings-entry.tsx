import { BotIcon } from "lucide-react";
import { screenStore } from "../../store/screen-store.ts";
import { FilledIcon } from "../../ui/filled-icon.tsx";
import { List, type ListItemType } from "../../ui/list.tsx";
import { userStore } from "../../store/user-store.ts";
import { ChevronIcon } from "../../ui/chevron-icon.tsx";

export function createMcpSettingsEntryItem(
  iconBgClassName = "bg-icon-violet",
): ListItemType {
  return {
    icon: (
      <FilledIcon className={iconBgClassName} icon={<BotIcon size={18} />} />
    ),
    text: "ChatGPT",
    right: <ChevronIcon direction="right" className="text-hint" />,
    onClick: () => {
      screenStore.push(
        userStore.isPaid
          ? { type: "mcpSettings" }
          : { type: "plans", planType: "pro" },
      );
    },
  };
}

export function McpSettingsEntry({
  trailingItems = [],
}: {
  trailingItems?: ListItemType[];
}) {
  return (
    <div className="mt-1">
      <List items={[createMcpSettingsEntryItem(), ...trailingItems]} />
    </div>
  );
}
