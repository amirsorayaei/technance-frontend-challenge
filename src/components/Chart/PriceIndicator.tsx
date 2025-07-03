import { animated, useSpring } from "react-spring";
import type { DataPoint, ChartScales } from "../../types/chart";
import {
  CHART_STYLES,
  CHART_ANIMATION_CONFIG,
  PRICE_CARD_DIMENSIONS,
} from "../../constants/chart";
import LivePriceCard from "../LivePriceCard";
import styles from "./Chart.module.scss";

interface PriceIndicatorProps {
  data: DataPoint[];
  yScale: ChartScales["yScale"];
  innerWidth: number;
}

export const PriceIndicator: React.FC<PriceIndicatorProps> = ({
  data,
  yScale,
  innerWidth,
}) => {
  const currentPoint = data[data.length - 1] || {
    timestamp: Date.now(),
    price: 0,
  };

  // Position the circle in the middle of the chart
  const centerX = innerWidth * 0.7;

  // Animated position for LivePriceCard
  const animatedPosition = useSpring({
    x: centerX + PRICE_CARD_DIMENSIONS.offsetX,
    y: yScale(currentPoint.price) - PRICE_CARD_DIMENSIONS.offsetY,
    config: CHART_ANIMATION_CONFIG,
  });

  // Animated position for circle
  const animatedCircle = useSpring({
    x: centerX,
    y: yScale(currentPoint.price),
    config: CHART_ANIMATION_CONFIG,
  });

  if (data.length === 0) return null;

  return (
    <>
      <animated.circle
        cx={animatedCircle.x}
        cy={animatedCircle.y}
        r={CHART_STYLES.circleRadius}
        fill={CHART_STYLES.circleFill}
        stroke={CHART_STYLES.circleStroke}
        strokeWidth={CHART_STYLES.circleStrokeWidth}
      />

      <animated.foreignObject
        x={animatedPosition.x}
        y={animatedPosition.y}
        width={PRICE_CARD_DIMENSIONS.width}
        height={PRICE_CARD_DIMENSIONS.height}
        className={styles.priceCard}
      >
        <LivePriceCard price={currentPoint.price} />
      </animated.foreignObject>
    </>
  );
};
