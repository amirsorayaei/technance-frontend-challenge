import type { ChartScales } from "../../types/chart";
import { CHART_STYLES } from "../../constants/chart";

interface ChartGridProps {
  xScale: ChartScales["xScale"];
  yScale: ChartScales["yScale"];
  innerWidth: number;
  innerHeight: number;
  yTicks: number[];
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  yScale,
  innerWidth,
  yTicks,
}) => {
  return (
    <g className="grid">
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={0}
            y1={yScale(tick)}
            x2={innerWidth}
            y2={yScale(tick)}
            stroke={CHART_STYLES.gridColor}
            strokeWidth={1}
            opacity={CHART_STYLES.gridOpacity}
          />
        </g>
      ))}
    </g>
  );
};
