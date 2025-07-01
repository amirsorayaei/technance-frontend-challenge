import { useRef } from "react";
import * as d3 from "d3";
import { animated, useSpring } from "react-spring";
import LivePriceCard from "../LivePriceCard";

import styles from "./Chart.module.scss";

interface DataPoint {
  timestamp: number;
  price: number;
}

interface ChartProps {
  data: DataPoint[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export const Chart: React.FC<ChartProps> = ({
  data,
  width,
  height,
  margin = { top: 20, right: 30, bottom: 30, left: 60 },
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.timestamp)) as [Date, Date])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.price) as [number, number])
    .range([innerHeight, 0])
    .nice();

  // Create line generator
  const lineGenerator = d3
    .line<DataPoint>()
    .x((d) => xScale(new Date(d.timestamp)))
    .y((d) => yScale(d.price))
    .curve(d3.curveMonotoneX);

  // Generate line path
  const linePath = lineGenerator(data) || "";

  // Generate Y-axis ticks
  const yTicks = yScale.ticks(5);

  // Animated line path
  const animatedPath = useSpring({
    d: linePath,
    config: { tension: 300, friction: 30 },
  });

  // Animated position for LivePriceCard
  const animatedPosition = useSpring({
    x:
      data.length > 0
        ? xScale(new Date(data[data.length - 1].timestamp)) + 15
        : 0,
    y: data.length > 0 ? yScale(data[data.length - 1].price) - 40 : 0,
    config: { tension: 300, friction: 30 },
  });

  // Animated position for circle
  const animatedCircle = useSpring({
    x: data.length > 0 ? xScale(new Date(data[data.length - 1].timestamp)) : 0,
    y: data.length > 0 ? yScale(data[data.length - 1].price) : 0,
    config: { tension: 300, friction: 30 },
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
        <g className="grid">
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={0}
                y1={yScale(tick)}
                x2={innerWidth}
                y2={yScale(tick)}
                stroke="#333"
                strokeWidth={1}
                opacity={0.3}
              />
            </g>
          ))}
        </g>

        {/* Y-axis */}
        <g className="y-axis">
          <line
            x1={-2}
            y1={0}
            x2={-2}
            y2={innerHeight}
            stroke="#666"
            strokeWidth={1}
          />
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={-5}
                y1={yScale(tick)}
                x2={0}
                y2={yScale(tick)}
                stroke="#666"
                strokeWidth={1}
              />
              <text
                x={-10}
                y={yScale(tick)}
                dy="0.32em"
                textAnchor="end"
                fill="#999"
                fontSize={12}
              >
                {tick}
              </text>
            </g>
          ))}
        </g>

        {/* Animated line */}
        <animated.path
          d={animatedPath.d}
          fill="none"
          stroke="#ffd700"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current price indicator */}
        {data.length > 0 && (
          <>
            <animated.circle
              cx={animatedCircle.x}
              cy={animatedCircle.y}
              r={4}
              fill="#ffd700"
              stroke="#fff"
              strokeWidth={2}
            />

            {/* LivePriceCard positioned at current price point */}
            <animated.foreignObject
              x={animatedPosition.x}
              y={animatedPosition.y}
              width={200}
              height={80}
              className={styles.priceCard}
            >
              <LivePriceCard price={data[data.length - 1].price} />
            </animated.foreignObject>
          </>
        )}
      </g>
    </svg>
  );
};
