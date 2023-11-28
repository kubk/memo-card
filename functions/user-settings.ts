import { handleError } from "./lib/handle-error/handle-error.ts";
import { getUser } from "./services/get-user.ts";
import { createAuthFailedResponse } from "./lib/json-response/create-auth-failed-response.ts";
import { createBadRequestResponse } from "./lib/json-response/create-bad-request-response.ts";
import { envSchema } from "./env/env-schema.ts";
import { z } from "zod";
import { getDatabase } from "./db/get-database.ts";
import { DatabaseException } from "./db/database-exception.ts";
import { createJsonResponse } from "./lib/json-response/create-json-response.ts";
import { Database } from "./db/databaseTypes.ts";

const requestSchema = z.object({
  isRemindNotifyEnabled: z.boolean(),
  isSpeakingCardEnabled: z.boolean().optional(),
  remindNotificationTime: z.string(),
});

export type UserSettingsRequest = z.infer<typeof requestSchema>;
export type UserSettingsResponse = null;

type UpdateUserSettingsDatabaseType = Partial<
  Database["public"]["Tables"]["user"]["Update"]
>;

export const onRequestPut = handleError(async ({ request, env }) => {
  const user = await getUser(request, env);
  if (!user) return createAuthFailedResponse();

  const input = requestSchema.safeParse(await request.json());
  if (!input.success) {
    return createBadRequestResponse();
  }

  const envSafe = envSchema.parse(env);

  const updateBody: UpdateUserSettingsDatabaseType = {
    is_remind_enabled: input.data.isRemindNotifyEnabled,
    last_reminded_date: input.data.remindNotificationTime,
  };
  if (input.data.isSpeakingCardEnabled !== undefined) {
    updateBody.is_speaking_card_enabled = input.data.isSpeakingCardEnabled;
  }

  const db = getDatabase(envSafe);
  const { error } = await db.from("user").update(updateBody).eq("id", user.id);

  if (error) {
    throw new DatabaseException(error);
  }

  return createJsonResponse<UserSettingsResponse>(null, 200);
});
