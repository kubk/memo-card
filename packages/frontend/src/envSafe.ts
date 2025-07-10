import * as v from "valibot";

const schema = v.object({
  VITE_BOT_APP_URL: v.string(),
  VITE_STAGE: v.picklist(["local", "staging", "production"]),
  VITE_API_URL: v.string(),
});

export const envSafe = v.parse(schema, import.meta.env);
