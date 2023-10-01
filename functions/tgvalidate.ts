import {
  createJsonResponse,
} from "./lib/json-response/create-json-response.ts";
import { validateTelegramRequest } from "./lib/telegram/validate-telegram-request.ts";
import { z } from "zod";
import { envSchema } from "./env/env-schema.ts";
import { errorResponseSchema } from "./lib/json-response/shared-schema.ts";

const requestSchema = z.object({
  hash: z.string(),
});

const responseSchema = z.object({
  user: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string().optional(),
    languageCode: z.string().optional(),
    username: z.string().optional(),
  }),
});

export type TgValidateRequest = z.infer<typeof requestSchema>;
export type TgValidateResponse = z.infer<typeof responseSchema>;

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const requestSafe = requestSchema.parse(await request.json());
  const envSafe = envSchema.parse(env);

  const result = await validateTelegramRequest(
    crypto,
    requestSafe.hash,
    envSafe.BOT_TOKEN,
  );

  if (result) {
    return createJsonResponse(responseSchema, { user: result }, 200);
  }

  return createJsonResponse(
    errorResponseSchema,
    { message: "Telegram auth didnt pass" },
    401,
  );
};
