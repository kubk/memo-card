import { describe, expect, test, vi } from "vitest";
import { translateNewCardsCount } from "./translate-new-cards-count.tsx";

const lang = vi.hoisted(() => vi.fn());
vi.mock("./t.ts", () => {
  return {
    translator: {
      getLang: lang,
    },
  };
});

describe("translate new cards count", () => {
  test("russian", () => {
    lang.mockReturnValue("ru");

    expect(translateNewCardsCount(1)).toBe("новая карточка");
    expect(translateNewCardsCount(2)).toBe("новые карточки");
    expect(translateNewCardsCount(3)).toBe("новые карточки");
    expect(translateNewCardsCount(5)).toBe("новых карточек");
    expect(translateNewCardsCount(9)).toBe("новых карточек");
    expect(translateNewCardsCount(15)).toBe("новых карточек");
    expect(translateNewCardsCount(20)).toBe("новых карточек");
    expect(translateNewCardsCount(21)).toBe("новая карточка");
  });

  test("english", () => {
    lang.mockReturnValue("en");

    expect(translateNewCardsCount(1)).toBe("new card");
    expect(translateNewCardsCount(2)).toBe("new cards");
    expect(translateNewCardsCount(3)).toBe("new cards");
    expect(translateNewCardsCount(21)).toBe("new cards");
  });

  test("spanish", () => {
    lang.mockReturnValue("es");

    expect(translateNewCardsCount(1)).toBe("nueva tarjeta");
    expect(translateNewCardsCount(2)).toBe("nuevas tarjetas");
    expect(translateNewCardsCount(3)).toBe("nuevas tarjetas");
    expect(translateNewCardsCount(21)).toBe("nuevas tarjetas");
  });

});

