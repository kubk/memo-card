import { links } from "api";
import { userStore } from "../../store/user-store.ts";

export const getYouTubeChannelLink = () => {
  const language = userStore.language;
  switch (language) {
    case "ru":
      return links.youtubeChannelRu;
    default:
      return links.youtubeChannelEn;
  }
};
