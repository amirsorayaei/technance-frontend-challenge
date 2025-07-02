export interface DataPoint {
  timestamp: number;
  price: number;
}

export interface ChartProps {
  data: DataPoint[];
  width: number;
  height: number;
  margin?: ChartMargin;
}

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ChartScales {
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export interface AnimatedPosition {
  x: number;
  y: number;
}
