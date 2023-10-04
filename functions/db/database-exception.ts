import { type PostgrestError } from "@supabase/postgrest-js/src/types.ts";

export class DatabaseException extends Error {
  constructor(public error: PostgrestError) {
    super();
  }
}
