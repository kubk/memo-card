import WebApp from "@twa-dev/sdk";
import { cloudStorageAdapter } from "./cloud-storage.ts";

export const storageAdapter = WebApp.isVersionAtLeast("6.9")
  ? cloudStorageAdapter
  : window.localStorage;
