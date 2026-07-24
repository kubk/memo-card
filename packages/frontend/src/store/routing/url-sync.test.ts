import { describe, expect, it } from "vitest";
import { type Route } from "./route-types.ts";
import { routeToUrl } from "./url-sync.ts";

describe("routeToUrl", () => {
  it("excludes transient preview state from the URL", () => {
    const route: Route = {
      type: "folderPreview",
      folderId: 42,
      state: {
        folder: {
          id: 42,
          title: "Travel English",
          authorId: 1,
          description: "Airport phrases",
          shareId: "travel",
          isPublic: true,
          categoryId: null,
          availableIn: "en",
          deckCategory: { name: "Travel", logo: "🇬🇧" },
        },
      },
    };

    expect(routeToUrl(route)).toBe("/?type=folderPreview&folderId=42");
  });
});
