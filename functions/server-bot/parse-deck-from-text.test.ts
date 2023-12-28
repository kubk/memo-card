import { expect, test } from "vitest";
import { parseCardsFromText } from "./parse-cards-from-text.ts";

test("parse deck from text", () => {
  expect(parseCardsFromText("front - back")).toEqual([
    {
      front: "front",
      back: "back",
      example: undefined,
    },
  ]);

  expect(parseCardsFromText("front - back - test")).toEqual([
    {
      front: "front",
      back: "back",
      example: "test",
    },
  ]);

  expect(parseCardsFromText("one side")).toEqual([
    {
      front: "one side",
      back: "one side",
      example: undefined,
    },
  ]);

  expect(parseCardsFromText("one side\na\nb")).toEqual([
    {
      front: "one side",
      back: "one side",
      example: undefined,
    },
    {
      front: "a",
      back: "a",
    },
    {
      front: "b",
      back: "b",
    },
  ]);

  expect(
    parseCardsFromText("front - back\na - b - c\nd - e\nk - n - m"),
  ).toEqual([
    {
      front: "front",
      back: "back",
      example: undefined,
    },
    {
      front: "a",
      back: "b",
      example: "c",
    },
    {
      front: "d",
      back: "e",
    },
    {
      front: "k",
      back: "n",
      example: "m",
    },
  ]);

  expect(
    parseCardsFromText("front - back\n\n\na - b - c\n\nd - e\nk - n - m"),
  ).toEqual([
    {
      front: "front",
      back: "back",
      example: undefined,
    },
    {
      front: "a",
      back: "b",
      example: "c",
    },
    {
      front: "d",
      back: "e",
    },
    {
      front: "k",
      back: "n",
      example: "m",
    },
  ]);
});
