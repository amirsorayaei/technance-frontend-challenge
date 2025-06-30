import styles from "./ChartPanel.module.scss";

export const ChartPanel = () => {
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.chartWrapper}>Chart</div>
      <div className={styles.priceCard}>Live Price Card</div>
    </div>
  );
};
