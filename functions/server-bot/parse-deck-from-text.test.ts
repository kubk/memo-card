import { expect, test } from "vitest";
import { parseDeckFromText } from "./parse-deck-from-text.ts";

test("parse deck from text", () => {
  expect(parseDeckFromText("front - back")).toEqual({
    front: "front",
    back: "back",
  });

  expect(parseDeckFromText("front - back - test")).toEqual({
    front: "front",
    back: "back",
  });

  expect(parseDeckFromText("one side")).toEqual({
    front: "one side",
    back: "one side",
  });
});
