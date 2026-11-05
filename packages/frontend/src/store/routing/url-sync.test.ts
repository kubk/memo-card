import { afterEach, describe, expect, it } from "vitest";
import { type Route } from "./route-types.ts";
import { routeToUrl, urlToRoute } from "./url-sync.ts";

describe("routeToUrl", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("excludes transient preview state from the URL", () => {
    const route: Route = {
      type: "folderPreview",
      folderId: "travel",
      state: {
        folder: {
          id: "travel",
          title: "Travel English",
          authorId: 1,
          description: "Airport phrases",
          isPublic: true,
          categoryId: null,
          availableIn: "en",
          deckCategory: { name: "Travel", logo: "🇬🇧" },
        },
      },
    };

    expect(routeToUrl(route)).toBe("/?type=folderPreview&folderId=travel");
  });

  it("serializes route data and encodes values", () => {
    const route: Route = {
      type: "deckForm",
      folderId: "travel",
      folderName: "Travel & English",
      searchText: "airport phrases",
    };

    expect(routeToUrl(route)).toBe(
      "/?type=deckForm&folderId=travel&folderName=Travel+%26+English&searchText=airport+phrases",
    );
  });

  it("preserves the Telegram start parameter", () => {
    window.history.replaceState(null, "", "/?start=catalog");

    expect(routeToUrl({ type: "deckPreview", deckId: "travel" })).toBe(
      "/?start=catalog&type=deckPreview&deckId=travel",
    );
    expect(routeToUrl({ type: "main" })).toBe("/?start=catalog");
  });
});

describe("urlToRoute", () => {
  it("parses route data", () => {
    expect(
      urlToRoute(
        "/?type=deckForm&folderId=travel&folderName=Travel+%26+English",
      ),
    ).toEqual({
      type: "deckForm",
      folderId: "travel",
      folderName: "Travel & English",
    });
  });

  it("round trips route values", () => {
    const route: Route = {
      type: "cardList",
      deckId: "travel",
      sortBy: "frontAlpha",
      sortDirection: "asc",
      searchText: "¿cómo estás?",
    };

    expect(urlToRoute(routeToUrl(route))).toEqual(route);
  });
});
