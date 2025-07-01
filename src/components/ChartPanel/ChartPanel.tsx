import LivePriceCard from "../LivePriceCard";
import styles from "./ChartPanel.module.scss";

export const ChartPanel = () => {
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.chartWrapper}>Chart</div>
      <div className={styles.priceCard}>
        <LivePriceCard price={165465} />
      </div>
    </div>
  );
};
