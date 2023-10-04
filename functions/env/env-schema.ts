import { z } from "zod";

export const envSchema = z.object({
  BOT_TOKEN: z.string(),
  SUPABASE_KEY: z.string(),
  SUPABASE_URL: z.string(),
});

export type EnvType = z.infer<typeof envSchema>;
