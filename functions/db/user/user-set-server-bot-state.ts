import { EnvSafe } from "../../env/env-schema.ts";
import { getDatabase } from "../get-database.ts";
import { DatabaseException } from "../database-exception.ts";

export type ServerBotState =
  | null
  | {
      // better name - cardGiven
      type: "cardAdded";
      cardFront: string;
      cardBack: string;
      cardExample: string | null;
    }
  | {
      // better name - manyCardsGiven
      type: "manyCardsAdded";
      cards: Array<{
        cardFront: string;
        cardBack: string;
        cardExample: string | null;
      }>;
    }
  | {
      type: "deckWithManyCardsSelected";
      deckId: number;
      cards: Array<{
        cardFront: string;
        cardBack: string;
        cardExample: string | null;
      }>;
    }
  | {
      // deck with only 1 card
      type: "deckSelected";
      cardFront: string;
      cardBack: string;
      cardExample: string | null;
      deckId: number;
      editingField?: "cardFront" | "cardBack" | "cardExample";
    };

export const userSetServerBotState = async (
  envSafe: EnvSafe,
  userId: number,
  state: ServerBotState,
) => {
  const db = getDatabase(envSafe);
  const { error } = await db
    .from("user")
    .update({ server_bot_state: state })
    .eq("id", userId);

  if (error) {
    throw new DatabaseException(error);
  }
};

export const userGetServerBotState = async (
  envSafe: EnvSafe,
  userId: number,
): Promise<ServerBotState> => {
  const db = getDatabase(envSafe);
  const result = await db
    .from("user")
    .select("server_bot_state")
    .eq("id", userId)
    .single();

  if (result.error) {
    throw new DatabaseException(result.error);
  }

  if (!result.data) {
    return null;
  }

  return result.data.server_bot_state as ServerBotState;
};
