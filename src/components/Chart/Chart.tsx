import { useEffect, useRef, useState, memo } from "react";
import { animated, useSpring } from "react-spring";
import type { ChartProps } from "../../types/chart";
import {
  DEFAULT_CHART_MARGIN,
  CHART_STYLES,
  REALTIME_ANIMATION_CONFIG,
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

export const Chart: React.FC<ChartProps> = memo(
  ({ data, width, height, margin = DEFAULT_CHART_MARGIN }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [showLineChart, setShowLineChart] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const prevDataLengthRef = useRef<number>(0);

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

    // Animated line path with drawing animation
    const springProps = useSpring({
      to: {
        d: linePath,
        stroke: CHART_STYLES.lineColor,
        strokeDasharray: isDrawing ? "1000" : "none",
        strokeDashoffset: isDrawing ? 1000 : 0, // Animate from 1000 to 0 for drawing effect
        opacity: showLineChart ? 1 : 0, // Fade in effect
      },
      config: {
        ...REALTIME_ANIMATION_CONFIG,
        duration: isDrawing ? 1000 : 300, // Slower for drawing, faster for updates
      },
      immediate: !showLineChart,
    });

    useEffect(() => {
      // Show line chart when we have data and a valid path
      if (data.length > 0 && linePath) {
        setShowLineChart(true);

        // Only trigger drawing animation for significant data changes
        const isSignificantChange = data.length !== prevDataLengthRef.current;
        if (isSignificantChange && data.length > 2) {
          // Start drawing animation
          setIsDrawing(true);
          // Stop drawing animation after animation completes
          setTimeout(() => setIsDrawing(false), 800);
        }
      }
      prevDataLengthRef.current = data.length;
    }, [linePath, data.length]);

    // Guard against insufficient data
    if (data.length < 2) {
      return (
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className={styles.chartContainer}
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <text x={width / 2} y={height / 2} textAnchor="middle" fill="#999">
              Waiting for data...
            </text>
          </g>
        </svg>
      );
    }

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
          {showLineChart && (
            <animated.path
              d={springProps.d}
              fill="none"
              stroke={springProps.stroke}
              strokeWidth={CHART_STYLES.lineWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={springProps.strokeDasharray}
              strokeDashoffset={springProps.strokeDashoffset}
              opacity={springProps.opacity}
            />
          )}

          {/* Current price indicator */}
          <PriceIndicator
            data={data}
            yScale={yScale}
            innerWidth={innerWidth}
            isDrawing={isDrawing}
          />
        </g>
      </svg>
    );
  }
);
