import { useRef } from "react";
import { animated, useSpring } from "react-spring";
import type { ChartProps } from "../../types/chart";
import {
  DEFAULT_CHART_MARGIN,
  CHART_STYLES,
  CHART_ANIMATION_CONFIG,
} from "../../constants/chart";
import {
  calculateChartDimensions,
  createChartScales,
  createLineGenerator,
  generateYAxisTicks,
} from "../../utils/chartUtils";
import { ChartGrid } from "./ChartGrid";
import { ChartAxis } from "./ChartAxis";
import { PriceIndicator } from "./PriceIndicator";
import styles from "./Chart.module.scss";

export const Chart: React.FC<ChartProps> = ({
  data,
  width,
  height,
  margin = DEFAULT_CHART_MARGIN,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate dimensions
  const { innerWidth, innerHeight } = calculateChartDimensions(
    width,
    height,
    margin
  );

  // Create scales
  const { xScale, yScale } = createChartScales(data, innerWidth, innerHeight);

  // Create line generator
  const lineGenerator = createLineGenerator(xScale, yScale);

  // Generate line path
  const linePath = lineGenerator(data) || "";

  // Generate Y-axis ticks
  const yTicks = generateYAxisTicks(yScale);

  // Animated line path
  const animatedPath = useSpring({
    d: linePath,
    config: CHART_ANIMATION_CONFIG,
  });

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={styles.chartContainer}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Grid lines */}
        <ChartGrid
          xScale={xScale}
          yScale={yScale}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          yTicks={yTicks}
        />

        {/* Y-axis */}
        <ChartAxis
          yScale={yScale}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
          yTicks={yTicks}
        />

        {/* Animated line */}
        <animated.path
          d={animatedPath.d}
          fill="none"
          stroke={CHART_STYLES.lineColor}
          strokeWidth={CHART_STYLES.lineWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current price indicator */}
        <PriceIndicator data={data} yScale={yScale} innerWidth={innerWidth} />
      </g>
    </svg>
  );
};
