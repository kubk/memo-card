import { EnvType } from "../env/env-schema.ts";
import { createClient } from "@supabase/supabase-js";
import { Database } from "./databaseTypes.ts";

export const getDatabase = (env: EnvType) => {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY);
};
