import type { PlansForUser } from "../../functions/db/plan/get-active-plans-for-user.ts";
import type { UserDbType } from "../../functions/db/user/upsert-user-db.ts";

export const canAdvancedShare = (user: UserDbType, plans?: PlansForUser) => {
  if (user.is_admin) {
    return true;
  }

  return plans?.some((plan) => plan.advanced_sharing);
};
