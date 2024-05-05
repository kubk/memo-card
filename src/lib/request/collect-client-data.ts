import WebApp from "@twa-dev/sdk";
import { PlatformSchemaType } from "../../../functions/services/get-user.ts";

export const collectClientData = () => {
  try {
    const data: PlatformSchemaType = {
      platform: WebApp.platform,
      colorScheme: WebApp.colorScheme,
      tgVersion: WebApp.version,
    };

    return JSON.stringify(data);
  } catch (e) {
    return "";
  }
};
