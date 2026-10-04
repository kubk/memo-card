import { languagesShared } from "api";
import { t, translationResourceStore } from "./t.ts";
import { beforeAll, describe, expect, test, vi } from "vitest";

const lang = vi.hoisted(() => vi.fn());
vi.mock("../store/user-store.ts", () => ({
  userStore: {
    get language() {
      return lang();
    },
  },
}));
beforeAll(async () => {
  await Promise.all(
    languagesShared.map((language) => translationResourceStore.load(language)),
  );
});

describe("translate new cards count", () => {
  test("russian", () => {
    lang.mockReturnValue("ru");

    expect(t("new_cards_count", { count: 1 })).toBe("1 новая карточка");
    expect(t("new_cards_count", { count: 2 })).toBe("2 новые карточки");
    expect(t("new_cards_count", { count: 3 })).toBe("3 новые карточки");
    expect(t("new_cards_count", { count: 5 })).toBe("5 новых карточек");
    expect(t("new_cards_count", { count: 9 })).toBe("9 новых карточек");
    expect(t("new_cards_count", { count: 15 })).toBe("15 новых карточек");
    expect(t("new_cards_count", { count: 20 })).toBe("20 новых карточек");
    expect(t("new_cards_count", { count: 21 })).toBe("21 новая карточка");
  });

  test("english", () => {
    lang.mockReturnValue("en");

    expect(t("new_cards_count", { count: 1 })).toBe("1 new card");
    expect(t("new_cards_count", { count: 2 })).toBe("2 new cards");
    expect(t("new_cards_count", { count: 3 })).toBe("3 new cards");
    expect(t("new_cards_count", { count: 21 })).toBe("21 new cards");
  });

  test("spanish", () => {
    lang.mockReturnValue("es");

    expect(t("new_cards_count", { count: 1 })).toBe("1 nueva tarjeta");
    expect(t("new_cards_count", { count: 2 })).toBe("2 nuevas tarjetas");
    expect(t("new_cards_count", { count: 3 })).toBe("3 nuevas tarjetas");
    expect(t("new_cards_count", { count: 21 })).toBe("21 nuevas tarjetas");
  });

  test("brazilian portuguese", () => {
    lang.mockReturnValue("pt-br");

    expect(t("new_cards_count", { count: 1 })).toBe("1 novo cartão");
    expect(t("new_cards_count", { count: 2 })).toBe("2 novos cartões");
    expect(t("new_cards_count", { count: 3 })).toBe("3 novos cartões");
    expect(t("new_cards_count", { count: 21 })).toBe("21 novos cartões");
  });
});
