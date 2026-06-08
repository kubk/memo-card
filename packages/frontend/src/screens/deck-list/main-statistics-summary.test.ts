import { describe, expect, it } from "vitest";
import { getPaddedSummaryWeek } from "./main-statistics-summary.tsx";

describe("main statistics summary", () => {
  it("pads a sparse summary week for display", () => {
    expect(
      getPaddedSummaryWeek(
        [
          { date: "2026-06-04", reviews: 3 },
          { date: "2026-06-08", reviews: 7 },
        ],
        "2026-06-08",
      ),
    ).toEqual([
      { date: "2026-06-02", reviews: 0 },
      { date: "2026-06-03", reviews: 0 },
      { date: "2026-06-04", reviews: 3 },
      { date: "2026-06-05", reviews: 0 },
      { date: "2026-06-06", reviews: 0 },
      { date: "2026-06-07", reviews: 0 },
      { date: "2026-06-08", reviews: 7 },
    ]);
  });
});
