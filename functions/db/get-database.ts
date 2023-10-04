import { EnvType } from "../env/env-schema.ts";
import { createClient } from "@supabase/supabase-js";

export const getDatabase = (env: EnvType) => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
};
