import { type PlansForUser } from "../../functions/db/plan/get-plans-for-user";
import { type UserDbType } from "../../functions/db/user/upsert-user-db";
import { type DeckOrFolderDbType } from "../../functions/db/plan/can-duplicate-deck-or-folder-db.ts";

export const canDuplicateDeckOrFolder = (
  user: UserDbType,
  deckOrFolder: DeckOrFolderDbType,
  plans?: PlansForUser,
) => {
  if (user.is_admin) {
    return true;
  }

  return (
    plans?.some((plan) => plan.advanced_duplicate) &&
    user.id === deckOrFolder.author_id
  );
};
