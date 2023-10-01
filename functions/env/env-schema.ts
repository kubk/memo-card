import { z } from "zod";

export const envSchema = z.object({
  BOT_TOKEN: z.string(),
});
