import WebApp from "@twa-dev/sdk";
import {
  TgValidateRequest,
  TgValidateResponse,
} from "../../functions/tgvalidate.ts";
import { request } from "../lib/request/request.ts";

const actualPayload = () => {
  return { hash: WebApp.initData };
};

export const tgValidate = () => {
  return request<TgValidateResponse, TgValidateRequest>(
    "/tgvalidate",
    "POST",
    actualPayload(),
  );
};
