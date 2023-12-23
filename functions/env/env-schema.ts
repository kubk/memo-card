import { z } from "zod";

export const envSchema = z.object({
  BOT_TOKEN: z.string(),
  SUPABASE_KEY: z.string(),
  SUPABASE_URL: z.string(),
  BOT_ERROR_REPORTING_TOKEN: z.string().optional(),
  BOT_ERROR_REPORTING_USER_ID: z.string().optional(),
  BOT_APP_URL_PLAIN: z.string(),
});

export type EnvSafe = z.infer<typeof envSchema>;
