import type { PlansForUser } from "../../functions/db/plan/get-active-plans-for-user.ts";
import type { UserDbType } from "../../functions/db/user/upsert-user-db.ts";

export const canUseAiMassGenerate = (
  user: UserDbType,
  plans?: PlansForUser,
) => {
  if (user.is_admin) {
    return true;
  }

  return plans?.some((plan) => plan.ai_mass_generate);
};
