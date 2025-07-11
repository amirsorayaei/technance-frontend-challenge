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
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.timestamp)) as [Date, Date])
    .range([0, innerWidth * 0.65]);

  // Calculate price range with buffers for potential price fluctuations
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Add small buffers: 2% of the range on each side to account for price fluctuations
  const buffer = priceRange * 0.02;

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
