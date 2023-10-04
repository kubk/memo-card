import { ZodError } from "zod";
import { DatabaseException } from "../../db/database-exception.ts";

export function handleError<T>(
  callback: (...args: Parameters<PagesFunction>) => Promise<T>,
): (...args: Parameters<PagesFunction>) => Promise<T> {
  return async (...args: Parameters<PagesFunction>) => {
    try {
      return await callback(...args);
    } catch (e) {
      if (e instanceof DatabaseException) {
        console.error(e.error);
        console.error(e.error.hint);
      }
      if (e instanceof ZodError) {
        console.error(e.issues);
      }
      throw e;
    }
  };
}
