import { animated, useSpring } from "react-spring";

import styles from "./LivePriceCard.module.scss";

import { type ILivePriceCardProps } from "./types";

export const LivePriceCard: React.FC<ILivePriceCardProps> = ({ price }) => {
  const animatedPrice = useSpring({
    number: price,
    config: { tension: 300, friction: 30 },
  });

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.priceHeader}>
        <span className={styles.label}>Live Price</span>
      </div>
      <div className={styles.priceValue}>
        <animated.span>
          {animatedPrice.number.to((n) => `$${n.toFixed(2)}`)}
        </animated.span>
      </div>
    </div>
  );
};
