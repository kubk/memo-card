import { describe, expect, it } from "vitest";
import { getPaddedHeatmap } from "./user-statistics-store.ts";

describe("user statistics store", () => {
  it("pads sparse review days without adding future days", () => {
    const heatmap = getPaddedHeatmap(
      [
        { date: "2026-06-08", reviews: 86 },
        { date: "2026-05-02", reviews: 4 },
        { date: "2026-04-30", reviews: 2 },
      ],
      "2026-06-08",
      false,
    );

    expect(heatmap).toHaveLength(92);
    expect(heatmap[0]).toEqual({ date: "2026-03-09", reviews: 0 });
    expect(heatmap.at(-1)).toEqual({
      date: "2026-06-08",
      reviews: 86,
    });
    expect(heatmap.find((day) => day.date === "2026-05-01")).toEqual({
      date: "2026-05-01",
      reviews: 0,
    });
    expect(heatmap.find((day) => day.date === "2026-04-30")).toEqual({
      date: "2026-04-30",
      reviews: 2,
    });
    expect(heatmap.some((day) => day.date === "2026-06-09")).toBe(false);
  });

  it("includes every day back to the week of the first review", () => {
    const heatmap = getPaddedHeatmap(
      [
        { date: "2026-06-08", reviews: 1 },
        { date: "2026-01-01", reviews: 10 },
      ],
      "2026-06-08",
      false,
    );

    expect(heatmap).toHaveLength(162);
    expect(heatmap[0]).toEqual({ date: "2025-12-29", reviews: 0 });
    expect(heatmap.find((day) => day.date === "2026-01-01")).toEqual({
      date: "2026-01-01",
      reviews: 10,
    });
    expect(heatmap.at(-1)).toEqual({
      date: "2026-06-08",
      reviews: 1,
    });
  });

  it("starts with a complete week while older pages are available", () => {
    const heatmap = getPaddedHeatmap(
      [
        { date: "2026-06-08", reviews: 1 },
        { date: "2026-02-01", reviews: 10 },
      ],
      "2026-06-08",
      true,
    );

    expect(heatmap[0]).toEqual({ date: "2026-02-02", reviews: 0 });
    expect(heatmap.some((day) => day.date === "2026-02-01")).toBe(false);
    expect(heatmap.at(-1)).toEqual({
      date: "2026-06-08",
      reviews: 1,
    });
  });

  it("uses the full 14 week window when today is Sunday", () => {
    const heatmap = getPaddedHeatmap(
      [{ date: "2026-06-14", reviews: 1 }],
      "2026-06-14",
      false,
    );

    expect(heatmap).toHaveLength(98);
    expect(heatmap[0]).toEqual({ date: "2026-03-09", reviews: 0 });
    expect(heatmap.at(-1)).toEqual({
      date: "2026-06-14",
      reviews: 1,
    });
  });

  it("keeps the recent window when there are no reviews", () => {
    const heatmap = getPaddedHeatmap([], "2026-06-08", false);

    expect(heatmap).toHaveLength(92);
    expect(heatmap.every((day) => day.reviews === 0)).toBe(true);
  });
});
