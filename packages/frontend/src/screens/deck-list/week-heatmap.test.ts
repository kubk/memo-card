import { describe, expect, it } from "vitest";
import { getPaddedWeekHeatmapDays } from "./week-heatmap.tsx";

describe("week heatmap", () => {
  it("pads sparse days for display", () => {
    expect(
      getPaddedWeekHeatmapDays(
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
