import Chart from "../Chart";
import styles from "./ChartPanel.module.scss";
import { generateBTCMockData } from "./constants";

export const ChartPanel = () => {
  const mockData = generateBTCMockData();

  return (
    <div className={styles.mainWrapper}>
      <Chart width={800} height={400} data={mockData} />
    </div>
  );
};
