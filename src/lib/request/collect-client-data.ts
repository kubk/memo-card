import { platform } from "../platform/platform.ts";

export const collectClientData = () => {
  try {
    const data = platform.getClientData();
    return JSON.stringify(data);
  } catch (e) {
    return "";
  }
};
