import { links } from "api/src/shared/links/links.ts";
import { userStore } from "../../store/user-store.ts";

export const getTelegramChannelLink = () => {
  const language = userStore.language;
  switch (language) {
    case "ru":
      return links.ruBotChannel;
    default:
      return links.botChannel;
  }
};
