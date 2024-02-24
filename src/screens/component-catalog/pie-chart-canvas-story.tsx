import { PieChartCanvas } from "../user-statistics/pie-chart-canvas.tsx";
import { css } from "@emotion/css";

export const PieChartCanvasStory = () => {
  return (
    <div
      className={css({
        display: "flex",
        gap: 16,
        flexDirection: "column",
      })}
    >
      <PieChartCanvas
        data={[
          { interval_range: "1-2", frequency: 10 },
          { interval_range: "3-4", frequency: 20 },
          { interval_range: "5-6", frequency: 30 },
        ]}
        width={200}
        height={200}
      />

      <PieChartCanvas
        data={[
          { interval_range: "1-2", frequency: 10 },
          { interval_range: "3-4", frequency: 20 },
        ]}
        width={200}
        height={200}
      />

      <PieChartCanvas
        data={[
          { interval_range: "1-2", frequency: 0 },
          { interval_range: "3-4", frequency: 0 },
          { interval_range: "5-6", frequency: 0 },
        ]}
        width={200}
        height={200}
      />
    </div>
  );
};
