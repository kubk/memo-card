import { expect, test } from "vitest";
import { escapeMarkdown } from "./escape-markdown.ts";

test("escape markdown", () => {
  expect(escapeMarkdown("Hello *World*")).toBe("Hello \\*World\\*");
  expect(escapeMarkdown("Test. Test.")).toBe("Test\\. Test\\.");
  expect(escapeMarkdown("Проверка - Check")).toBe("Проверка \\- Check");
  expect(escapeMarkdown("Test")).toBe("Test");
});
