import { describe, expect, it } from "vitest";
import { type Route } from "./route-types.ts";
import { routeToUrl } from "./url-sync.ts";

describe("routeToUrl", () => {
  it("excludes transient preview state from the URL", () => {
    const route: Route = {
      type: "deckPreview",
      deckId: 42,
      state: {
        deck: {
          id: 42,
          name: "Travel English",
          authorId: 1,
          description: "Airport phrases",
          shareId: "travel",
          isPublic: true,
          speakLocale: null,
          speakField: null,
          speakAutoAi: false,
          reverseCards: false,
          cardInputModeId: null,
          deckCards: [],
          deckCategory: { name: "Travel", logo: "🇬🇧" },
        },
      },
    };

    expect(routeToUrl(route)).toBe("/?type=deckPreview&deckId=42");
  });
});
