import Chart from "../Chart";
import styles from "./ChartPanel.module.scss";
import { useLiveData } from "../../hooks/useLiveData";

export const ChartPanel = () => {
  const { data, isConnected, isLoading } = useLiveData(50);

  return (
    <div className={styles.mainWrapper}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>Connecting to live data...</p>
        </div>
      ) : (
        <>
          <div className={styles.statusIndicator}>
            <div
              className={`${styles.statusDot} ${
                isConnected ? styles.connected : styles.disconnected
              }`}
            />
            <span>{isConnected ? "Live Data" : "Disconnected"}</span>
          </div>
          <Chart width={800} height={400} data={data} />
        </>
      )}
    </div>
  );
};
