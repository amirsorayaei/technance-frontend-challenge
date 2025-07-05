import type { ChartScales } from "../../types/chart";
import { CHART_STYLES } from "../../constants/chart";

interface ChartAxisProps {
  yScale: ChartScales["yScale"];
  innerHeight: number;
  innerWidth: number;
  yTicks: number[];
}

export const ChartAxis: React.FC<ChartAxisProps> = ({
  yScale,
  innerHeight,
  innerWidth,
  yTicks,
}) => {
  return (
    <g className="y-axis">
      <line
        x1={innerWidth}
        y1={0}
        x2={innerWidth}
        y2={innerHeight}
        stroke={CHART_STYLES.axisColor}
        strokeWidth={1}
      />
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={innerWidth + 5}
            y1={yScale(tick)}
            x2={innerWidth}
            y2={yScale(tick)}
            stroke={CHART_STYLES.axisColor}
            strokeWidth={1}
          />
          <text
            x={innerWidth + 15}
            y={yScale(tick)}
            dy="0.32em"
            textAnchor="start"
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
