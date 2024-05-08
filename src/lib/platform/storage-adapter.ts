import { cloudStorageAdapter } from "./telegram/cloud-storage.ts";
import { platform } from "./platform.ts";
import { TelegramPlatform } from "./telegram/telegram-platform.ts";

export const storageAdapter =
  platform instanceof TelegramPlatform && platform.isCloudStorageAvailable()
    ? cloudStorageAdapter
    : window.localStorage;
