import type { ChartScales } from "../../types/chart";
import { CHART_STYLES } from "../../constants/chart";

interface ChartAxisProps {
  yScale: ChartScales["yScale"];
  innerHeight: number;
  yTicks: number[];
}

export const ChartAxis: React.FC<ChartAxisProps> = ({
  yScale,
  innerHeight,
  yTicks,
}) => {
  return (
    <g className="y-axis">
      <line
        x1={-2}
        y1={0}
        x2={-2}
        y2={innerHeight}
        stroke={CHART_STYLES.axisColor}
        strokeWidth={1}
      />
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={-5}
            y1={yScale(tick)}
            x2={0}
            y2={yScale(tick)}
            stroke={CHART_STYLES.axisColor}
            strokeWidth={1}
          />
          <text
            x={-10}
            y={yScale(tick)}
            dy="0.32em"
            textAnchor="end"
            fill={CHART_STYLES.textColor}
            fontSize={12}
          >
            {tick}
          </text>
        </g>
      ))}
    </g>
  );
};
