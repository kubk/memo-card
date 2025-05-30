import { colord } from "colord";
import { theme } from "../../ui/theme.tsx";
import { useEffect, useRef } from "react";

export type PieChartData = {
  interval_range: string;
  frequency: number;
};

export const chartStart = colord(theme.buttonColorLighter)
  .lighten(0.05)
  .toRgbString();

export const chartFinish = colord(theme.buttonColorComputed)
  .darken(0.2)
  .toRgbString();

const interpolateColor = (
  color1: string,
  color2: string,
  factor: number,
): string => {
  // Assumes color1 and color2 are CSS color strings "rgb(r, g, b)"
  const result = color1
    .slice(4, -1)
    .split(",")
    .map(Number)
    .map((c1, i) => {
      const c2 = Number(color2.slice(4, -1).split(",")[i]);
      return Math.round(c1 + (c2 - c1) * factor);
    });
  return `rgb(${result.join(", ")})`;
};

type Props = {
  data: PieChartData[];
  width: number;
  height: number;
};

export function PieChartCanvas({ data, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const totalFrequency = data.reduce((acc, item) => acc + item.frequency, 0);
    let startAngle = 0;

    data.forEach((item, index) => {
      const sliceAngle = (item.frequency / totalFrequency) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.arc(
        width / 2,
        height / 2,
        Math.min(width, height) / 2,
        startAngle,
        endAngle,
      );
      ctx.closePath();

      // Avoid division by 0
      const factor = index / (data.length - 1) || 0;

      ctx.fillStyle = interpolateColor(chartStart, chartFinish, factor);
      ctx.fill();

      startAngle = endAngle;
    });
  }, [data, height, width]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
