import { platform } from "../lib/platform/platform.ts";
import { collectClientData } from "./collect-client-data.ts";
import { UserHeaders } from "api";

export function getAuthHeaders() {
  const initData = platform.getInitData();

  return {
    [UserHeaders.Hash]: initData ? initData : "",
    [UserHeaders.Platform]: collectClientData(),
    "Content-Type": "application/json",
  };
}
