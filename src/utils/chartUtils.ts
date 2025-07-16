import * as d3 from "d3";
import type { DataPoint, ChartScales } from "../types/chart";
import { DEFAULT_CHART_MARGIN } from "../constants/chart";

export const calculateChartDimensions = (
  width: number,
  height: number,
  margin = DEFAULT_CHART_MARGIN
) => {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return { innerWidth, innerHeight };
};

export const createChartScales = (
  data: DataPoint[],
  innerWidth: number,
  innerHeight: number
): ChartScales => {
  // Handle edge cases with insufficient data
  if (data.length < 2) {
    // Return default scales for insufficient data
    const now = new Date();
    const defaultPrice = 45000; // Default BTC price

    const xScale = d3
      .scaleTime()
      .domain([now, now])
      .range([0, innerWidth * 0.65]);

    const yScale = d3
      .scaleLinear()
      .domain([defaultPrice - 100, defaultPrice + 100])
      .range([innerHeight, 0])
      .nice();

    return { xScale, yScale };
  }

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.timestamp)) as [Date, Date])
    .range([0, innerWidth * 0.65]);

  // Calculate price range with smaller buffers for more responsive updates
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Reduce buffer size for more responsive updates: 1% instead of 2%
  const buffer = priceRange * 0.01;

  const yScale = d3
    .scaleLinear()
    .domain([minPrice - buffer, maxPrice + buffer])
    .range([innerHeight, 0])
    .nice();

  return { xScale, yScale };
};

export const createLineGenerator = (
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  return d3
    .line<DataPoint>()
    .x((d) => xScale(new Date(d.timestamp)))
    .y((d) => yScale(d.price))
    .curve(d3.curveMonotoneX);
};

export const generateYAxisTicks = (yScale: d3.ScaleLinear<number, number>) => {
  return yScale.ticks(6);
};
