import { expect, test } from "vitest";
import { renderManyCardsToCreate } from "./render-many-cards-to-create.ts";

test("render-many-cards-to-create", async () => {
  const translator = {
    translate: (key: string) => key,
  } as any;

  expect(renderManyCardsToCreate([], translator)).toMatchInlineSnapshot(
    '"confirm_many_cards_creation"',
  );

  expect(
    renderManyCardsToCreate(
      [
        {
          cardFront: "front",
          cardBack: "back",
          cardExample: "example",
        },
        {
          cardFront: "a",
          cardBack: "b",
          cardExample: "c",
        },
      ],
      translator,
    ),
  ).toMatchInlineSnapshot(`
    "confirm_many_cards_creation

    *1*\\\\. *confirm_many_cards_front* front
    *confirm_many_cards_back* back
    *confirm_many_cards_example* example

    *2*\\\\. *confirm_many_cards_front* a
    *confirm_many_cards_back* b
    *confirm_many_cards_example* c"
  `);
});
