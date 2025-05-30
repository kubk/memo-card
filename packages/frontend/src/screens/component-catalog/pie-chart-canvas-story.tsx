import { PieChartCanvas } from "../user-statistics/pie-chart-canvas.tsx";
import { Flex } from "../../ui/flex.tsx";

export function PieChartCanvasStory() {
  return (
    <Flex gap={16} direction={"column"}>
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
    </Flex>
  );
}
