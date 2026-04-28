import { describe, expect, it } from "vitest";
import { removeAllTags } from "./remove-all-tags.ts";

describe("removeAllTags", () => {
  it("keeps word boundaries for line break tags", () => {
    expect(removeAllTags({ text: "first<br>second" })).toBe("first second");
  });

  it("collapses multiple line break tags into one space", () => {
    expect(removeAllTags({ text: "first<br><br />\n<BR>second" })).toBe(
      "first second",
    );
  });

  it("does not add spaces for inline formatting tags", () => {
    expect(removeAllTags({ text: "<b>first</b><i>second</i>" })).toBe(
      "firstsecond",
    );
  });
});
