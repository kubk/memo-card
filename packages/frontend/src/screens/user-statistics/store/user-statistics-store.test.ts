import { describe, expect, it } from "vitest";
import { getPaddedRecentHeatmap } from "./user-statistics-store.ts";

describe("user statistics store", () => {
  it("pads sparse review days without adding future days", () => {
    const recentHeatmap = getPaddedRecentHeatmap(
      [
        { date: "2026-04-30", reviews: 2 },
        { date: "2026-05-02", reviews: 4 },
        { date: "2026-06-08", reviews: 86 },
      ],
      "2026-06-08",
    );

    expect(recentHeatmap).toHaveLength(92);
    expect(recentHeatmap[0]).toEqual({ date: "2026-03-09", reviews: 0 });
    expect(recentHeatmap.at(-1)).toEqual({
      date: "2026-06-08",
      reviews: 86,
    });
    expect(recentHeatmap.find((day) => day.date === "2026-05-01")).toEqual({
      date: "2026-05-01",
      reviews: 0,
    });
    expect(recentHeatmap.find((day) => day.date === "2026-04-30")).toEqual({
      date: "2026-04-30",
      reviews: 2,
    });
    expect(recentHeatmap.some((day) => day.date === "2026-06-09")).toBe(false);
  });

  it("ignores sparse review days outside the displayed window", () => {
    const recentHeatmap = getPaddedRecentHeatmap(
      [
        { date: "2026-01-01", reviews: 10 },
        { date: "2026-06-08", reviews: 1 },
      ],
      "2026-06-08",
    );

    expect(recentHeatmap).toHaveLength(92);
    expect(recentHeatmap.some((day) => day.date === "2026-01-01")).toBe(false);
    expect(recentHeatmap.at(-1)).toEqual({
      date: "2026-06-08",
      reviews: 1,
    });
  });

  it("uses the full 14 week window when today is Sunday", () => {
    const recentHeatmap = getPaddedRecentHeatmap(
      [{ date: "2026-06-14", reviews: 1 }],
      "2026-06-14",
    );

    expect(recentHeatmap).toHaveLength(98);
    expect(recentHeatmap[0]).toEqual({ date: "2026-03-09", reviews: 0 });
    expect(recentHeatmap.at(-1)).toEqual({
      date: "2026-06-14",
      reviews: 1,
    });
  });
});
